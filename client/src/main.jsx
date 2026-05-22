import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const navByRole = {
  admin: [
    ['Dashboard', 'dashboard', 'home'],
    ['Veterinarians', 'vets', 'vet'],
    ['Clients & Pets', 'clients', 'paw'],
    ['Appointments', 'booking', 'cal'],
    ['Vaccinations', 'vax', 'shot'],
    ['Follow-ups', 'followup', 'loop']
  ],
  doctor: [
    ['Appointments', 'calendar', 'cal'],
    ['AI SOAP Note', 'soap', 'note'],
    ['Weight Records', 'weight', 'scale'],
    ['Follow-ups', 'followup', 'loop']
  ],
  superadmin: [
    ['Dashboard', 'dashboard', 'home'],
    ['All Vets', 'vets', 'vet'],
    ['Reports', 'dashboard', 'chart']
  ]
};

const tabs = [
  ['Dashboard', 'dashboard'],
  ['Veterinarians', 'vets'],
  ['Clients & Pets', 'clients'],
  ['Pet Profile', 'petprofile'],
  ['Vaccination Tracker', 'vax'],
  ['Book Appointment', 'booking'],
  ['AI SOAP Note', 'soap'],
  ['Weight Tracker', 'weight'],
  ['Follow-up Tracker', 'followup'],
  ['Doctor Calendar', 'calendar']
];

const icons = {
  home: '⌂',
  vet: '+',
  paw: '◆',
  cal: '◫',
  shot: '!',
  loop: '↻',
  note: 'N',
  scale: 'S',
  chart: '▥'
};

function useApi() {
  const [data, setData] = useState({
    dashboard: null,
    vets: [],
    clients: [],
    appointments: [],
    vaccinations: [],
    followups: [],
    weights: [],
    soapnotes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const names = ['dashboard', 'vets', 'clients', 'appointments', 'vaccinations', 'followups', 'weights', 'soapnotes'];
      const results = await Promise.all(names.map((name) => fetch(`${API_URL}/${name}`).then((res) => {
        if (!res.ok) throw new Error(`API request failed: ${name}`);
        return res.json();
      })));
      setData(Object.fromEntries(names.map((name, index) => [name, results[index]])));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function create(resource, body) {
    const res = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Could not create ${resource}`);
    await load();
  }

  async function update(resource, id, body) {
    const res = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Could not update ${resource}`);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, create, update, reload: load };
}

function App() {
  const { data, loading, error, create, update, reload } = useApi();
  const [screen, setScreen] = useState('dashboard');
  const [role, setRole] = useState('admin');

  const activePet = useMemo(() => data.clients.flatMap((client) => client.pets.map((pet) => ({ ...pet, ownerName: client.name, email: client.email, phone: client.phone }))).find((pet) => pet.name === 'Buddy'), [data.clients]);

  function switchRole(nextRole) {
    setRole(nextRole);
    setScreen(nextRole === 'doctor' ? 'calendar' : 'dashboard');
  }

  return (
    <div className="proto-shell">
      <header className="proto-header">
        <h1>PawChart MERN</h1>
        <p>Clinic operations, patient records, bookings, reminders, and SOAP notes backed by MongoDB.</p>
      </header>

      <div className="screen-tabs">
        {tabs.map(([label, id]) => <button key={id} className={`stab ${screen === id ? 'active' : ''}`} onClick={() => setScreen(id)}>{label}</button>)}
      </div>

      <div className="app-frame">
        <aside className="sidebar">
          <div className="sb-top">
            <div className="sb-brand"><span className="paw-mark">◆</span> Paw<span>Chart</span></div>
            <label className="sb-field-label">Role</label>
            <select className="sb-select" value={role} onChange={(event) => switchRole(event.target.value)}>
              <option value="admin">Clinic Admin</option>
              <option value="doctor">Doctor</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div className="sb-clinic">Riverside Veterinary Clinic</div>
          <nav className="sb-nav">
            {navByRole[role].map(([label, id, icon]) => (
              <button key={`${role}-${label}`} className={`nav-item ${screen === id ? 'active' : ''}`} onClick={() => setScreen(id)}>
                <span className="ni">{icons[icon]}</span>{label}
                {label === 'Vaccinations' && <span className="nav-badge">{data.dashboard?.stats?.vaccinesDue ?? 0}</span>}
                {label === 'Follow-ups' && <span className="nav-badge">{data.dashboard?.stats?.followUpsPending ?? 0}</span>}
              </button>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="pulse-row"><span className="pulse-dot" />Monitoring {data.dashboard?.monitoring?.length ?? 0} follow-ups</div>
            <div className="fp-sub">System watching for earlier slots</div>
          </div>
        </aside>

        <main className="main">
          {loading && <Status message="Loading clinic data..." />}
          {error && <Status message={`${error}. Start the API and seed MongoDB.`} tone="error" action={reload} />}
          {!loading && !error && (
            <>
              {screen === 'dashboard' && <Dashboard data={data.dashboard} go={setScreen} />}
              {screen === 'vets' && <Vets vets={data.vets} create={create} />}
              {screen === 'clients' && <Clients clients={data.clients} create={create} />}
              {screen === 'petprofile' && <PetProfile pet={activePet} soap={data.soapnotes[0]} />}
              {screen === 'vax' && <Vaccinations rows={data.vaccinations} update={update} />}
              {screen === 'booking' && <Booking vets={data.vets} clients={data.clients} create={create} />}
              {screen === 'soap' && <Soap note={data.soapnotes[0]} create={create} />}
              {screen === 'weight' && <Weights weights={data.weights} create={create} />}
              {screen === 'followup' && <FollowUps rows={data.followups} />}
              {screen === 'calendar' && <Calendar appointments={data.appointments} go={setScreen} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Status({ message, tone = 'info', action }) {
  return <div className="status"><div className={`status-box ${tone}`}>{message}{action && <button className="btn btn-primary" onClick={action}>Retry</button>}</div></div>;
}

function Dashboard({ data, go }) {
  const stats = data?.stats || {};
  return <Screen title="Good morning" sub="Friday, May 22, 2026 · live clinic dashboard" action={<button className="btn btn-primary" onClick={() => go('booking')}>+ New Appointment</button>}>
    <div className="stat-grid">
      <Stat primary label="TODAY'S APPOINTMENTS" value={stats.appointmentsToday ?? 0} hint="Live from appointment records" />
      <Stat label="ACTIVE PATIENTS" value={stats.activePatients ?? 0} hint="Pets across client accounts" />
      <Stat label="VACCINES DUE" value={stats.vaccinesDue ?? 0} hint="Overdue or due soon" danger />
      <Stat label="FOLLOW-UPS PENDING" value={stats.followUpsPending ?? 0} hint="Awaiting confirmation" />
    </div>
    <div className="grid-two">
      <section className="panel no-pad">
        <div className="panel-head"><strong>Today's Appointments</strong><span className="badge b-blue">{data?.appointments?.length ?? 0} total</span></div>
        <AppointmentList rows={data?.appointments || []} />
      </section>
      <section className="panel">
        <div className="card-label">Alerts & Reminders</div>
        {(data?.alerts || []).map((item) => <Alert key={item._id} title={`${item.petName} needs ${item.vaccine}`} meta={`${item.ownerName} · ${item.status}`} />)}
        <div className="monitor-box"><span className="pulse-dot" /> Background monitoring active for {data?.monitoring?.length ?? 0} patient(s)</div>
      </section>
    </div>
  </Screen>;
}

function Stat({ label, value, hint, primary, danger }) {
  return <div className={`stat-card ${primary ? 'primary' : ''}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-num">{value}</div>
    <div className={`stat-change ${danger ? 'danger' : ''}`}>{hint}</div>
  </div>;
}

function Vets({ vets, create }) {
  const [open, setOpen] = useState(false);
  return <Screen title="Veterinarians" sub={`Riverside Veterinary Clinic · ${vets.length} vets on staff`} action={<button className="btn btn-primary" onClick={() => setOpen(true)}>+ Onboard Vet</button>}>
    <Table headers={['Name', 'Specialization', 'License', 'Room', 'Status']}>
      {vets.map((vet) => <tr key={vet._id}><td><Name title={vet.name} sub={vet.email} /></td><td>{vet.specialization}</td><td>{vet.license}</td><td>{vet.room}</td><td><Badge value={vet.status} /></td></tr>)}
    </Table>
    {open && <VetModal onClose={() => setOpen(false)} onSave={(body) => create('vets', body).then(() => setOpen(false))} />}
  </Screen>;
}

function Clients({ clients, create }) {
  const [open, setOpen] = useState(false);
  return <Screen title="Clients & Pets" sub={`${clients.reduce((sum, client) => sum + client.pets.length, 0)} pets across ${clients.length} client accounts`} action={<button className="btn btn-primary" onClick={() => setOpen(true)}>+ Register New Client</button>}>
    <div className="search-row"><input className="search-box" placeholder="Search by owner name, pet name, phone, or Pet ID..." /><button className="btn btn-outline">Search</button></div>
    <Table headers={['Owner', 'Pets', 'Phone', 'Alerts']}>
      {clients.map((client) => <tr key={client._id}><td><Name title={client.name} sub={client.email} /></td><td><div className="chips">{client.pets.map((pet) => <span className="pet-chip" key={pet._id}>{pet.name}</span>)}</div></td><td>{client.phone}</td><td>{client.pets.flatMap((pet) => pet.alerts).length ? <Badge value={`${client.pets.flatMap((pet) => pet.alerts).length} alert(s)`} tone="red" /> : <Badge value="Up to date" tone="green" />}</td></tr>)}
    </Table>
    {open && <ClientModal onClose={() => setOpen(false)} onSave={(body) => create('clients', body).then(() => setOpen(false))} />}
  </Screen>;
}

function PetProfile({ pet, soap }) {
  if (!pet) return <Status message="Seed the database to view Buddy's profile." />;
  return <Screen title={`Pet Profile · ${pet.name}`} sub={`${pet.breed} · ${pet.age} · ${pet.ownerName}`}>
    <div className="grid-two">
      <section className="panel"><div className="pet-hero"><div className="avatar">{pet.name[0]}</div><div><h3>{pet.name}</h3><p>{pet.species} · {pet.sex} · {pet.color}</p><p>{pet.email} · {pet.phone}</p></div></div><div className="chips">{pet.alerts.map((alert) => <span className="badge b-amber" key={alert}>{alert}</span>)}</div></section>
      <section className="panel"><div className="card-label">Latest SOAP Assessment</div><p>{soap?.assessment}</p><p className="muted">{soap?.plan}</p></section>
    </div>
  </Screen>;
}

function Vaccinations({ rows, update }) {
  return <Screen title="Vaccination Tracker" sub="Clinic-wide · Auto-reminders enabled" action={<button className="btn btn-accent">Send Reminder Batch</button>}>
    <Table headers={['Pet', 'Owner', 'Vaccine', 'Due Date', 'Status', 'Reminder', 'Action']}>
      {rows.map((row) => <tr key={row._id}><td><Name title={row.petName} sub={row.breed} /></td><td>{row.ownerName}</td><td>{row.vaccine}</td><td>{row.dueDate}</td><td><Badge value={row.status} /></td><td>{row.reminderStatus}</td><td><button className="btn btn-outline btn-sm" onClick={() => update('vaccinations', row._id, { reminderStatus: 'Sent just now' })}>Notify Owner</button></td></tr>)}
    </Table>
  </Screen>;
}

function Booking({ vets, clients, create }) {
  const [form, setForm] = useState({ petName: 'Buddy', ownerName: 'James Martinez', vetName: vets[0]?.name || '', reason: 'Annual Wellness', date: '2026-05-22', time: '15:00', type: 'Checkup' });
  const pets = clients.flatMap((client) => client.pets.map((pet) => ({ petName: pet.name, ownerName: client.name })));
  return <Screen title="Book Appointment" sub="Select pet, vet, reason, and time slot">
    <section className="panel form-panel">
      <div className="steps"><span className="step done">1</span><span /><span className="step done">2</span><span /><span className="step current">3</span></div>
      <div className="form-grid">
        <Select label="Pet" value={form.petName} onChange={(value) => {
          const pet = pets.find((item) => item.petName === value);
          setForm({ ...form, petName: value, ownerName: pet?.ownerName || form.ownerName });
        }} options={pets.map((pet) => pet.petName)} />
        <Select label="Vet" value={form.vetName} onChange={(value) => setForm({ ...form, vetName: value })} options={vets.map((vet) => vet.name)} />
        <Input label="Reason" value={form.reason} onChange={(value) => setForm({ ...form, reason: value })} />
        <Input label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
        <Input label="Time" type="time" value={form.time} onChange={(value) => setForm({ ...form, time: value })} />
      </div>
      <button className="btn btn-primary" onClick={() => create('appointments', { ...form, status: 'Scheduled' })}>Confirm Appointment</button>
    </section>
  </Screen>;
}

function Soap({ note, create }) {
  const [draft, setDraft] = useState(note || {});
  return <Screen title="AI SOAP Note" sub="Editable medical note saved to MongoDB">
    <div className="soap-grid">
      {['subjective', 'objective', 'assessment', 'plan'].map((field) => <label className="soap-card" key={field}><span>{field[0].toUpperCase()} · {field}</span><textarea value={draft[field] || ''} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} /></label>)}
    </div>
    <button className="btn btn-primary" onClick={() => create('soapnotes', { ...draft, petName: draft.petName || 'Buddy', ownerName: draft.ownerName || 'James Martinez', vetName: draft.vetName || 'Dr. Sarah Chen' })}>Save SOAP Note</button>
  </Screen>;
}

function Weights({ weights, create }) {
  const [value, setValue] = useState('32.4');
  const buddy = weights.filter((row) => row.petName === 'Buddy');
  return <Screen title="Weight Tracker · Buddy" sub="Golden Retriever · healthy range: 29-34 lbs" action={<button className="btn btn-primary btn-sm" onClick={() => create('weights', { petName: 'Buddy', ownerName: 'James Martinez', value: Number(value), unit: 'lbs', date: new Date().toISOString().slice(0, 10), note: 'Manual entry' })}>+ Log Weight</button>}>
    <div className="grid-two">
      <section className="panel"><div className="chart-bars">{buddy.map((row) => <div key={row._id} style={{ height: `${row.value * 4}px` }} title={`${row.value} lbs`} />)}</div><input className="input" value={value} onChange={(event) => setValue(event.target.value)} /></section>
      <section className="panel">{buddy.map((row) => <div className="log-row" key={row._id}><strong>{row.value} {row.unit}</strong><span>{row.date}</span><span>{row.note}</span></div>)}</section>
    </div>
  </Screen>;
}

function FollowUps({ rows }) {
  return <Screen title="Follow-up Tracker" sub="Planned vs confirmed dates">
    <Table headers={['Pet / Owner', 'Vet', 'Purpose', 'Plan Date', 'Confirmed Date', 'Priority', 'Status']}>
      {rows.map((row) => <tr key={row._id}><td><Name title={row.petName} sub={row.ownerName} /></td><td>{row.vetName}</td><td>{row.purpose}</td><td>{row.planDate}</td><td>{row.confirmedDate || 'Not confirmed'}</td><td>{row.priority}</td><td><Badge value={row.monitoring ? 'Watching' : row.status} /></td></tr>)}
    </Table>
  </Screen>;
}

function Calendar({ appointments, go }) {
  return <Screen title="Doctor Calendar" sub="Pet, owner, and reason visible in every slot">
    <div className="calendar-layout">
      <aside className="queue"><div className="card-label">Today's Queue</div>{appointments.slice(0, 4).map((appt) => <button key={appt._id} onClick={() => go('soap')}><strong>{appt.petName}</strong><span>{appt.ownerName} · {appt.reason}</span><small>{appt.time}</small></button>)}</aside>
      <section className="week-grid">{appointments.map((appt) => <button className={`cal-ev ${appt.status === 'Now' ? 'now' : ''}`} key={appt._id} onClick={() => go('soap')}><strong>{appt.time} · {appt.petName}</strong><span>{appt.ownerName}</span><small>{appt.reason}</small></button>)}</section>
    </div>
  </Screen>;
}

function Screen({ title, sub, action, children }) {
  return <div className="main-scroll"><div className="main-pad"><div className="topbar"><div><h2>{title}</h2><div className="sub">{sub}</div></div>{action}</div>{children}</div></div>;
}

function Table({ headers, children }) {
  return <section className="panel no-pad"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></section>;
}

function AppointmentList({ rows }) {
  return <div className="appointment-list">{rows.map((row) => <div className="appt" key={row._id}><div><strong>{row.petName}</strong><span>{row.ownerName} · {row.reason}</span></div><div><strong>{row.time}</strong><Badge value={row.type} /></div></div>)}</div>;
}

function Alert({ title, meta }) {
  return <div className="alert-row"><strong>{title}</strong><span>{meta}</span></div>;
}

function Name({ title, sub }) {
  return <div><div className="td-name">{title}</div><div className="td-sub">{sub}</div></div>;
}

function Badge({ value, tone }) {
  const color = tone || (String(value).includes('Overdue') || String(value).includes('alert') ? 'red' : String(value).includes('Available') || String(value).includes('Up to date') ? 'green' : String(value).includes('Pending') || String(value).includes('Due') ? 'amber' : 'blue');
  return <span className={`badge b-${color}`}>{value}</span>;
}

function Input({ label, value, onChange, type = 'text' }) {
  return <label className="field-label">{label}<input className="input" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label className="field-label">{label}<select className="input" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function VetModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: 'General Practice', license: '', experienceYears: 1, consultationFee: 75, status: 'Available', room: 'Room 1' });
  return <Modal title="Onboard Veterinarian" onClose={onClose}><ModalForm form={form} setForm={setForm} fields={['name', 'email', 'phone', 'specialization', 'license', 'room']} /><button className="btn btn-primary" onClick={() => onSave(form)}>Onboard</button></Modal>;
}

function ClientModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', petName: '', species: 'Dog', breed: '' });
  const save = () => onSave({ name: form.name, email: form.email, phone: form.phone, address: form.address, pets: [{ name: form.petName, species: form.species, breed: form.breed, age: 'New', alerts: [] }] });
  return <Modal title="Register New Client & Pet" onClose={onClose}><ModalForm form={form} setForm={setForm} fields={['name', 'email', 'phone', 'address', 'petName', 'species', 'breed']} /><button className="btn btn-primary" onClick={save}>Register</button></Modal>;
}

function ModalForm({ form, setForm, fields }) {
  return <div className="form-grid">{fields.map((field) => <Input key={field} label={field} value={form[field] || ''} onChange={(value) => setForm({ ...form, [field]: value })} />)}</div>;
}

function Modal({ title, onClose, children }) {
  return <div className="modal-wrap"><section className="modal"><div className="modal-hd"><h3>{title}</h3><button className="modal-x" onClick={onClose}>×</button></div>{children}</section></div>;
}

createRoot(document.getElementById('root')).render(<App />);

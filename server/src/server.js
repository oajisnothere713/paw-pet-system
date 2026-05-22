import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDb } from './db.js';
import { Appointment, Client, FollowUp, SoapNote, Vaccination, Vet, WeightLog } from './models.js';

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pawchart';

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const resources = {
  vets: Vet,
  clients: Client,
  appointments: Appointment,
  vaccinations: Vaccination,
  followups: FollowUp,
  weights: WeightLog,
  soapnotes: SoapNote
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pawchart-api' });
});

app.get('/api/dashboard', async (_req, res, next) => {
  try {
    const [appointments, clients, vaccinations, followUps] = await Promise.all([
      Appointment.find().sort({ date: 1, time: 1 }).lean(),
      Client.find().lean(),
      Vaccination.find().lean(),
      FollowUp.find().lean()
    ]);
    const activePatients = clients.reduce((total, client) => total + client.pets.length, 0);
    res.json({
      stats: {
        appointmentsToday: appointments.filter((item) => item.date === '2026-05-22').length,
        activePatients,
        vaccinesDue: vaccinations.filter((item) => item.status !== 'Up to date').length,
        followUpsPending: followUps.filter((item) => item.status === 'Pending').length
      },
      appointments: appointments.slice(0, 5),
      alerts: vaccinations.filter((item) => item.status !== 'Up to date').slice(0, 4),
      monitoring: followUps.filter((item) => item.monitoring)
    });
  } catch (error) {
    next(error);
  }
});

Object.entries(resources).forEach(([name, Model]) => {
  app.get(`/api/${name}`, async (_req, res, next) => {
    try {
      res.json(await Model.find().sort({ createdAt: -1 }).lean());
    } catch (error) {
      next(error);
    }
  });

  app.post(`/api/${name}`, async (req, res, next) => {
    try {
      const created = await Model.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  app.patch(`/api/${name}/:id`, async (req, res, next) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: `${name} record not found` });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  app.delete(`/api/${name}/:id`, async (req, res, next) => {
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: `${name} record not found` });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Unexpected server error' });
});

try {
  await connectDb(mongoUri);
  app.listen(port, () => {
    console.log(`PawChart API listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error(`Could not connect to MongoDB at ${mongoUri}. Start your local MongoDB service or update server/.env with a MongoDB Atlas URI.`);
  console.error(error.message);
  process.exit(1);
}

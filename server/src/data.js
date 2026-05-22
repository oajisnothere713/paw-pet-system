export const seedData = {
  vets: [
    { name: 'Dr. Sarah Chen', email: 'sarah.chen@riverside.vet', phone: '(555) 110-2030', specialization: 'General Practice', license: 'RV-10245', experienceYears: 9, consultationFee: 75, status: 'Available', room: 'Room 2' },
    { name: 'Dr. Raj Patel', email: 'raj.patel@riverside.vet', phone: '(555) 110-2031', specialization: 'Surgery', license: 'RV-10246', experienceYears: 12, consultationFee: 95, status: 'Available', room: 'Surgery' },
    { name: 'Dr. Maya Osei', email: 'maya.osei@riverside.vet', phone: '(555) 110-2032', specialization: 'Dermatology', license: 'RV-10247', experienceYears: 7, consultationFee: 85, status: 'In Consultation', room: 'Room 4' },
    { name: 'Dr. Tom Reed', email: 'tom.reed@riverside.vet', phone: '(555) 110-2033', specialization: 'Exotics', license: 'RV-10248', experienceYears: 6, consultationFee: 80, status: 'Available', room: 'Room 1' }
  ],
  clients: [
    { name: 'James Martinez', email: 'james.m@email.com', phone: '(555) 824-3901', address: '118 Maple Ave', pets: [
      { name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', emoji: 'Dog', age: '4 yrs', sex: 'Male', color: 'Golden', microchip: '982000411223344', weightRange: '29-34 lbs', alerts: ['Rabies booster needed', 'Follow-up in 14 days'] },
      { name: 'Max', species: 'Dog', breed: 'Beagle', emoji: 'Dog', age: '3 yrs', sex: 'Male', color: 'Tri-color', microchip: '982000411223345', weightRange: '20-30 lbs', alerts: [] }
    ] },
    { name: 'Sarah Kim', email: 'sarah.k@email.com', phone: '(555) 291-4822', address: '45 Cedar St', pets: [
      { name: 'Mochi', species: 'Cat', breed: 'Siamese Cat', emoji: 'Cat', age: '2 yrs', sex: 'Female', color: 'Cream', microchip: '982000411223346', weightRange: '8-12 lbs', alerts: ['FVRCP overdue'] }
    ] },
    { name: 'Amy Liu', email: 'amy.liu@email.com', phone: '(555) 673-9012', address: '908 Pine Rd', pets: [
      { name: 'Cinnamon', species: 'Rabbit', breed: 'Mini Rex', emoji: 'Rabbit', age: '1 yr', sex: 'Female', color: 'Brown', microchip: '982000411223347', weightRange: '3-5 lbs', alerts: [] },
      { name: 'Whiskers', species: 'Cat', breed: 'Domestic Shorthair', emoji: 'Cat', age: '5 yrs', sex: 'Male', color: 'Gray', microchip: '982000411223348', weightRange: '9-13 lbs', alerts: [] }
    ] },
    { name: 'Tom Wilson', email: 't.wilson@email.com', phone: '(555) 441-2930', address: '77 Oak Blvd', pets: [
      { name: 'Kiwi', species: 'Bird', breed: 'Parrot', emoji: 'Bird', age: '6 yrs', sex: 'Female', color: 'Green', microchip: '', weightRange: '0.8-1.2 lbs', alerts: [] }
    ] },
    { name: 'Maria Garcia', email: 'm.garcia@email.com', phone: '(555) 882-1144', address: '322 River Ln', pets: [
      { name: 'Luna', species: 'Dog', breed: 'French Bulldog', emoji: 'Dog', age: '5 yrs', sex: 'Female', color: 'Fawn', microchip: '982000411223349', weightRange: '18-28 lbs', alerts: ['Post-op follow-up today'] }
    ] }
  ],
  appointments: [
    { petName: 'Buddy', ownerName: 'James Martinez', vetName: 'Dr. Sarah Chen', reason: 'Annual Wellness', date: '2026-05-22', time: '10:00', type: 'Checkup', status: 'Now' },
    { petName: 'Mochi', ownerName: 'Sarah Kim', vetName: 'Dr. Raj Patel', reason: 'Vaccination', date: '2026-05-22', time: '10:30', type: 'Vaccination', status: 'Scheduled' },
    { petName: 'Cinnamon', ownerName: 'Amy Liu', vetName: 'Dr. Sarah Chen', reason: 'Dental exam', date: '2026-05-23', time: '11:00', type: 'Checkup', status: 'Scheduled' },
    { petName: 'Kiwi', ownerName: 'Tom Wilson', vetName: 'Dr. Tom Reed', reason: 'Wing check', date: '2026-05-22', time: '11:30', type: 'Checkup', status: 'Scheduled' },
    { petName: 'Luna', ownerName: 'Maria Garcia', vetName: 'Dr. Sarah Chen', reason: 'Post-op follow-up', date: '2026-05-22', time: '14:00', type: 'Follow-up', status: 'Scheduled' }
  ],
  vaccinations: [
    { petName: 'Buddy', ownerName: 'James Martinez', breed: 'Golden Retriever', vaccine: 'Rabies', lastDate: '2025-05-18', dueDate: '2026-05-18', status: 'Overdue', reminderStatus: 'Not sent' },
    { petName: 'Buddy', ownerName: 'James Martinez', breed: 'Golden Retriever', vaccine: 'Leptospirosis', lastDate: '2025-06-02', dueDate: '2026-06-02', status: 'Due soon', reminderStatus: 'Sent May 19' },
    { petName: 'Mochi', ownerName: 'Sarah Kim', breed: 'Siamese Cat', vaccine: 'FVRCP', lastDate: '2025-04-28', dueDate: '2026-04-28', status: 'Overdue', reminderStatus: 'Not sent' },
    { petName: 'Luna', ownerName: 'Maria Garcia', breed: 'French Bulldog', vaccine: 'DHPP', lastDate: '2025-05-21', dueDate: '2026-05-21', status: 'Up to date', reminderStatus: 'Auto-sent Apr 21' }
  ],
  followUps: [
    { petName: 'Buddy', ownerName: 'James Martinez', vetName: 'Dr. Chen', purpose: 'Ear recheck', planDate: '2026-04-29', confirmedDate: '2026-04-30', time: '11:00 AM', priority: 'Routine', status: 'Scheduled', monitoring: false },
    { petName: 'Luna', ownerName: 'Maria Garcia', vetName: 'Dr. Chen', purpose: 'Post-op check', planDate: '2026-04-29', confirmedDate: '', time: '', priority: 'Routine', status: 'Pending', monitoring: true },
    { petName: 'Mochi', ownerName: 'Sarah Kim', vetName: 'Dr. Patel', purpose: 'Vaccine follow-up', planDate: '2026-04-29', confirmedDate: '2026-04-28', time: '2:00 PM', priority: 'Routine', status: 'Scheduled', monitoring: false }
  ],
  weights: [
    { petName: 'Buddy', ownerName: 'James Martinez', value: 32.2, unit: 'lbs', date: '2026-05-22', note: 'Wellness visit' },
    { petName: 'Buddy', ownerName: 'James Martinez', value: 31.5, unit: 'lbs', date: '2026-03-14', note: 'Routine check' },
    { petName: 'Buddy', ownerName: 'James Martinez', value: 30.9, unit: 'lbs', date: '2026-01-08', note: 'Diet review' },
    { petName: 'Mochi', ownerName: 'Sarah Kim', value: 9.4, unit: 'lbs', date: '2026-05-22', note: 'Vaccine visit' }
  ],
  soapNotes: [
    {
      petName: 'Buddy',
      ownerName: 'James Martinez',
      vetName: 'Dr. Sarah Chen',
      subjective: 'Owner reports left ear scratching for four days and mild head shaking. Appetite and energy are normal.',
      objective: 'Left ear canal erythematous with moderate waxy debris. Temperature normal. Weight 32.2 lbs.',
      assessment: 'Likely otitis externa, mild. Rabies booster is overdue.',
      plan: 'Otomax ear drops, four drops in left ear twice daily for seven days. Follow-up in 14 days and administer rabies booster.',
      tags: ['Otomax 4 drops', 'Rabies booster due', 'Follow-up in 14 days']
    }
  ]
};

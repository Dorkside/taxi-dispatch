export default [
  {
    id: 1,
    patient: { id: 1, name: "Jean Bave", type: "Dialyse" },
    date: new Date().toISOString().substring(0, 10),
    time: "07:15",
    chauffeur: { id: 1, name: "John Doe" }
  },
  {
    id: 2,
    patient: { id: 1, name: "Jean Bave", type: "Dialyse" },
    date: new Date().toISOString().substring(0, 10),
    time: "19:15",
    chauffeur: { id: 1, name: "John Doe" }
  },
  {
    id: 3,
    patient: { id: 1, name: "Jean Bave", type: "Dialyse" },
    date: new Date().toISOString().substring(0, 10),
    time: "12:30",
    chauffeur: { id: 2, name: "Jane Doe" }
  }
];

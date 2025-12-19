import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
} from "./routes/patients";
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "./routes/appointments";
import {
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialty,
} from "./routes/doctors";
import {
  getHistory,
  getPatientHistory,
  addToHistory,
} from "./routes/history";
import {
  getConsultations,
  createConsultation,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
} from "./routes/consultations";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Patients routes
  app.get("/api/patients", getPatients);
  app.post("/api/patients", createPatient);
  app.get("/api/patients/:id", getPatientById);
  app.put("/api/patients/:id", updatePatient);
  app.delete("/api/patients/:id", deletePatient);

  // Appointments routes
  app.get("/api/appointments", getAppointments);
  app.post("/api/appointments", createAppointment);
  app.get("/api/appointments/:id", getAppointmentById);
  app.put("/api/appointments/:id", updateAppointment);
  app.delete("/api/appointments/:id", deleteAppointment);

  // Doctors routes
  app.get("/api/doctors", getDoctors);
  app.get("/api/doctors/specialty/:specialty", getDoctorsBySpecialty);
  app.get("/api/doctors/:id", getDoctorById);

  // Clinical History routes
  app.get("/api/history", getHistory);
  app.get("/api/history/patient/:patientId", getPatientHistory);
  app.post("/api/history", addToHistory);

  // Quick Consultations routes
  app.get("/api/consultations", getConsultations);
  app.post("/api/consultations", createConsultation);
  app.get("/api/consultations/:id", getConsultationById);
  app.put("/api/consultations/:id", updateConsultation);
  app.delete("/api/consultations/:id", deleteConsultation);

  return app;
}

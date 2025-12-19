import { RequestHandler } from "express";
import { AppointmentsResponse, CreateAppointmentRequest, Appointment } from "@shared/api";

// In-memory storage
const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Wilson",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    reason: "Regular checkup",
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "2",
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Brown",
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    reason: "Consultation",
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export const getAppointments: RequestHandler = (_req, res) => {
  const response: AppointmentsResponse = {
    appointments,
    count: appointments.length,
  };
  res.json(response);
};

export const createAppointment: RequestHandler = (req, res) => {
  const { patientId, doctorId, dateTime, reason, notes } = req.body as CreateAppointmentRequest;

  // Basic validation
  if (!patientId || !doctorId || !dateTime || !reason) {
    res.status(400).json({
      error: "Missing required fields: patientId, doctorId, dateTime, reason",
    });
    return;
  }

  // Mock patient and doctor lookup (in real app, would query database)
  const patientName = `Patient ${patientId}`;
  const doctorName = `Dr. Doctor ${doctorId}`;

  const newAppointment: Appointment = {
    id: String(nextId++),
    patientId,
    doctorId,
    patientName,
    doctorName,
    dateTime,
    reason,
    status: "scheduled",
    notes,
    createdAt: new Date().toISOString(),
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
};

export const getAppointmentById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const appointment = appointments.find((a) => a.id === id);

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(appointment);
};

export const updateAppointment: RequestHandler = (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex((a) => a.id === id);

  if (appointmentIndex === -1) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  const updatedAppointment = { ...appointments[appointmentIndex], ...req.body };
  appointments[appointmentIndex] = updatedAppointment;

  res.json(updatedAppointment);
};

export const deleteAppointment: RequestHandler = (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex((a) => a.id === id);

  if (appointmentIndex === -1) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  const deletedAppointment = appointments.splice(appointmentIndex, 1)[0];
  res.json(deletedAppointment);
};

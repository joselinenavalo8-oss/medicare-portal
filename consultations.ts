import { RequestHandler } from "express";
import { QuickConsultationsResponse, CreateQuickConsultationRequest, QuickConsultation } from "@shared/api";
import { patients } from "./patients";
import { doctors } from "./doctors";

// In-memory storage
const consultations: QuickConsultation[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Wilson",
    date: new Date().toISOString(),
    notes: "Patient requested follow-up on medication effectiveness",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Jane Smith",
    doctorId: "2",
    doctorName: "Dr. Michael Brown",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notes: "Quick check-in regarding symptoms",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export const getConsultations: RequestHandler = (_req, res) => {
  const response: QuickConsultationsResponse = {
    consultations,
    count: consultations.length,
  };
  res.json(response);
};

export const createConsultation: RequestHandler = (req, res) => {
  const { patientId, doctorId, notes } = req.body as CreateQuickConsultationRequest;

  if (!patientId || !doctorId || !notes) {
    res.status(400).json({
      error: "Missing required fields: patientId, doctorId, notes",
    });
    return;
  }

  const patient = patients.find((p) => p.id === patientId);
  const doctor = doctors.find((d) => d.id === doctorId);

  if (!patient || !doctor) {
    res.status(404).json({
      error: "Patient or doctor not found",
    });
    return;
  }

  const newConsultation: QuickConsultation = {
    id: String(nextId++),
    patientId,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId,
    doctorName: `Dr. ${doctor.lastName}`,
    date: new Date().toISOString(),
    notes,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  consultations.push(newConsultation);

  res.status(201).json(newConsultation);
};

export const getConsultationById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const consultation = consultations.find((c) => c.id === id);

  if (!consultation) {
    res.status(404).json({ error: "Consultation not found" });
    return;
  }

  res.json(consultation);
};

export const updateConsultation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const consultationIndex = consultations.findIndex((c) => c.id === id);

  if (consultationIndex === -1) {
    res.status(404).json({ error: "Consultation not found" });
    return;
  }

  const updatedConsultation = { ...consultations[consultationIndex], ...req.body };
  consultations[consultationIndex] = updatedConsultation;

  res.json(updatedConsultation);
};

export const deleteConsultation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const consultationIndex = consultations.findIndex((c) => c.id === id);

  if (consultationIndex === -1) {
    res.status(404).json({ error: "Consultation not found" });
    return;
  }

  const deletedConsultation = consultations.splice(consultationIndex, 1)[0];
  res.json(deletedConsultation);
};

import { RequestHandler } from "express";
import { HistoryResponse, ClinicalHistory } from "@shared/api";

// In-memory storage
const history: ClinicalHistory[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: "Hypertension",
    treatment: "Prescribed Lisinopril 10mg daily",
    notes: "Blood pressure elevated, monitor daily",
    doctorName: "Dr. Sarah Wilson",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    patientId: "1",
    patientName: "John Doe",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: "Regular checkup",
    treatment: "Continue current medications",
    notes: "Overall health good, maintain exercise routine",
    doctorName: "Dr. Sarah Wilson",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    patientId: "2",
    patientName: "Jane Smith",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: "Common cold",
    treatment: "Rest and OTC medications",
    notes: "Symptoms should resolve in 7-10 days",
    doctorName: "Dr. Michael Brown",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 4;

export const getHistory: RequestHandler = (_req, res) => {
  const response: HistoryResponse = {
    history,
    count: history.length,
  };
  res.json(response);
};

export const getPatientHistory: RequestHandler = (req, res) => {
  const { patientId } = req.params;

  const patientHistory = history.filter((h) => h.patientId === patientId);

  const response: HistoryResponse = {
    history: patientHistory,
    count: patientHistory.length,
  };
  res.json(response);
};

export const addToHistory: RequestHandler = (req, res) => {
  const { patientId, patientName, diagnosis, treatment, notes, doctorName } = req.body;

  if (!patientId || !diagnosis || !treatment || !notes) {
    res.status(400).json({
      error: "Missing required fields: patientId, diagnosis, treatment, notes",
    });
    return;
  }

  const newEntry: ClinicalHistory = {
    id: String(nextId++),
    patientId,
    patientName: patientName || `Patient ${patientId}`,
    date: new Date().toISOString(),
    diagnosis,
    treatment,
    notes,
    doctorName: doctorName || "Dr. Unknown",
    createdAt: new Date().toISOString(),
  };

  history.push(newEntry);

  res.status(201).json(newEntry);
};

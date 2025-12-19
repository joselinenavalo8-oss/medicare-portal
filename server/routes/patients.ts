import { RequestHandler } from "express";
import { PatientsResponse, CreatePatientRequest, Patient } from "@shared/api";

// In-memory storage (will be replaced with actual database)
export const patients: Patient[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    address: "123 Main St, City",
    medicalId: "MED001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    dateOfBirth: "1990-07-22",
    gender: "Female",
    address: "456 Oak Ave, City",
    medicalId: "MED002",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "1980-11-08",
    gender: "Male",
    address: "789 Pine Rd, City",
    medicalId: "MED003",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 4;

export const getPatients: RequestHandler = (_req, res) => {
  const response: PatientsResponse = {
    patients,
    count: patients.length,
  };
  res.json(response);
};

export const createPatient: RequestHandler = (req, res) => {
  const { firstName, lastName, email, phone, dateOfBirth, gender, address, medicalId } = req.body as CreatePatientRequest;

  // Basic validation
  if (!firstName || !lastName || !email || !phone) {
    res.status(400).json({
      error: "Missing required fields: firstName, lastName, email, phone",
    });
    return;
  }

  const newPatient: Patient = {
    id: String(nextId++),
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    address,
    medicalId,
    createdAt: new Date().toISOString(),
  };

  patients.push(newPatient);

  res.status(201).json(newPatient);
};

export const getPatientById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  res.json(patient);
};

export const updatePatient: RequestHandler = (req, res) => {
  const { id } = req.params;
  const patientIndex = patients.findIndex((p) => p.id === id);

  if (patientIndex === -1) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  const updatedPatient = { ...patients[patientIndex], ...req.body };
  patients[patientIndex] = updatedPatient;

  res.json(updatedPatient);
};

export const deletePatient: RequestHandler = (req, res) => {
  const { id } = req.params;
  const patientIndex = patients.findIndex((p) => p.id === id);

  if (patientIndex === -1) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  const deletedPatient = patients.splice(patientIndex, 1)[0];
  res.json(deletedPatient);
};

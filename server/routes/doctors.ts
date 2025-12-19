import { RequestHandler } from "express";
import { DoctorsResponse, Doctor } from "@shared/api";

// In-memory storage
export const doctors: Doctor[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@hospital.com",
    specialty: "Cardiology",
    phone: "+1 (555) 111-2222",
    licenseNumber: "LIC001",
    yearsOfExperience: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@hospital.com",
    specialty: "General Practice",
    phone: "+1 (555) 333-4444",
    licenseNumber: "LIC002",
    yearsOfExperience: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@hospital.com",
    specialty: "Neurology",
    phone: "+1 (555) 555-6666",
    licenseNumber: "LIC003",
    yearsOfExperience: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Taylor",
    email: "james.taylor@hospital.com",
    specialty: "Orthopedics",
    phone: "+1 (555) 777-8888",
    licenseNumber: "LIC004",
    yearsOfExperience: 15,
    createdAt: new Date().toISOString(),
  },
];

export const getDoctors: RequestHandler = (_req, res) => {
  const response: DoctorsResponse = {
    doctors,
    count: doctors.length,
  };
  res.json(response);
};

export const getDoctorById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.json(doctor);
};

export const getDoctorsBySpecialty: RequestHandler = (req, res) => {
  const { specialty } = req.query;

  if (!specialty) {
    const response: DoctorsResponse = {
      doctors,
      count: doctors.length,
    };
    res.json(response);
    return;
  }

  const filtered = doctors.filter((d) =>
    d.specialty.toLowerCase().includes(String(specialty).toLowerCase())
  );

  const response: DoctorsResponse = {
    doctors: filtered,
    count: filtered.length,
  };
  res.json(response);
};

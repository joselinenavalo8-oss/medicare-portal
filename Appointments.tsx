import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AppointmentsResponse,
  Appointment,
  CreateAppointmentRequest,
  PatientsResponse,
  DoctorsResponse,
} from "@shared/api";

export default function Appointments() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    patientId: "",
    doctorId: "",
    dateTime: "",
    reason: "",
    notes: "",
  });

  // Pre-fill doctor if coming from Doctors page
  useEffect(() => {
    const doctorId = searchParams.get("doctorId");
    if (doctorId) {
      setFormData((prev) => ({ ...prev, doctorId }));
      setShowForm(true);
      // Clear the query parameter
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Fetch appointments
  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      return res.json() as Promise<AppointmentsResponse>;
    },
  });

  // Fetch patients for dropdown
  const { data: patientsData } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      return res.json() as Promise<PatientsResponse>;
    },
  });

  // Fetch doctors for dropdown
  const { data: doctorsData } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await fetch("/api/doctors");
      return res.json() as Promise<DoctorsResponse>;
    },
  });

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: async (newAppointment: CreateAppointmentRequest) => {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });
      return res.json() as Promise<Appointment>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      resetForm();
      setShowForm(false);
    },
  });

  // Update appointment status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      dateTime: "",
      reason: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.dateTime || !formData.reason) {
      alert("Please fill in required fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getPatientName = (id: string) => {
    const patient = patientsData?.patients.find((p) => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${id}`;
  };

  const getDoctorName = (id: string) => {
    const doctor = doctorsData?.doctors.find((d) => d.id === id);
    return doctor ? `Dr. ${doctor.lastName}` : `Doctor ${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-medical-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">Citas</h1>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="gap-2 bg-gradient-to-r from-green-600 to-green-700"
          >
            <Plus className="w-4 h-4" />
            Schedule Appointment
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Schedule New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Patient *
                  </label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select Patient</option>
                    {patientsData?.patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Doctor *
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select Doctor</option>
                    {doctorsData?.doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.lastName} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date & Time *
                  </label>
                  <Input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for Visit *
                  </label>
                  <Input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Regular checkup"
                    className="bg-slate-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-green-700"
                >
                  {createMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-slate-600">
              Loading appointments...
            </div>
          ) : appointmentsData?.appointments && appointmentsData.appointments.length > 0 ? (
            <>
              {appointmentsData.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Patient</p>
                      <p className="font-semibold text-slate-900">{appointment.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Doctor</p>
                      <p className="font-semibold text-slate-900">{appointment.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date & Time</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(appointment.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Reason</p>
                      <p className="font-semibold text-slate-900">{appointment.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : appointment.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {appointment.status === "scheduled" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: appointment.id, status: "completed" })
                            }
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: appointment.id, status: "cancelled" })
                            }
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(appointment.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer with count */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-6 py-4">
                <p className="text-sm text-slate-600">
                  Total Appointments: <span className="font-semibold text-slate-900">{appointmentsData.count}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
              <p className="text-slate-600 mb-4">No appointments scheduled</p>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-gradient-to-r from-green-600 to-green-700"
              >
                <Plus className="w-4 h-4" />
                Schedule First Appointment
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

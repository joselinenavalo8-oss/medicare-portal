import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QuickConsultationsResponse,
  CreateQuickConsultationRequest,
  QuickConsultation,
  PatientsResponse,
  DoctorsResponse,
} from "@shared/api";

export default function QuickConsultations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateQuickConsultationRequest>({
    patientId: "",
    doctorId: "",
    notes: "",
  });

  // Fetch consultations
  const { data: consultationsData, isLoading, isError: consultationsError } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const res = await fetch("/api/consultations");
      if (!res.ok) throw new Error("Failed to fetch consultations");
      return res.json() as Promise<QuickConsultationsResponse>;
    },
  });

  // Fetch patients
  const { data: patientsData, isError: patientsError } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      if (!res.ok) throw new Error("Failed to fetch patients");
      return res.json() as Promise<PatientsResponse>;
    },
  });

  // Fetch doctors
  const { data: doctorsData, isError: doctorsError } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await fetch("/api/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return res.json() as Promise<DoctorsResponse>;
    },
  });

  // Create consultation mutation
  const createMutation = useMutation({
    mutationFn: async (newConsultation: CreateQuickConsultationRequest) => {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConsultation),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create consultation");
      }
      return res.json() as Promise<QuickConsultation>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      resetForm();
      setShowForm(false);
    },
    onError: (error) => {
      console.error("Error creating consultation:", error);
    },
  });

  // Complete consultation mutation
  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Failed to complete consultation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
    onError: (error) => {
      console.error("Error completing consultation:", error);
    },
  });

  // Delete consultation mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete consultation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
    onError: (error) => {
      console.error("Error deleting consultation:", error);
    },
  });

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.notes) {
      alert("Please fill in all fields");
      return;
    }
    if (patientsError || doctorsError) {
      alert("Error loading patient or doctor data. Please refresh and try again.");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            <h1 className="text-2xl font-bold text-slate-900">
              Consultas Rápidas
            </h1>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="gap-2 bg-gradient-to-r from-pink-600 to-pink-700"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">New Quick Consultation</h2>

            {(patientsError || doctorsError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm font-medium">Unable to load form data. Please refresh and try again.</p>
              </div>
            )}

            {createMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm font-medium">Failed to create consultation. Please try again.</p>
              </div>
            )}

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
                    disabled={patientsError || !patientsData}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{patientsError ? "Error loading patients" : "Select Patient"}</option>
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
                    disabled={doctorsError || !doctorsData}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{doctorsError ? "Error loading doctors" : "Select Doctor"}</option>
                    {doctorsData?.doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.lastName} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Consultation Notes *
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter consultation notes..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || patientsError || doctorsError}
                  className="bg-gradient-to-r from-pink-600 to-pink-700"
                >
                  {createMutation.isPending ? "Creating..." : "Create Consultation"}
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

        {/* Consultations List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-slate-600">
              Loading consultations...
            </div>
          ) : consultationsData?.consultations && consultationsData.consultations.length > 0 ? (
            <>
              {/* Active consultations */}
              {consultationsData.consultations.filter((c) => c.status === "active").length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Active Consultations</h3>
                  <div className="space-y-4 mb-8">
                    {consultationsData.consultations
                      .filter((c) => c.status === "active")
                      .map((consultation) => (
                        <div
                          key={consultation.id}
                          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-slate-900">
                                {consultation.patientName}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {consultation.doctorName} • {new Date(consultation.date).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              Active
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-4 mb-4">
                            <p className="text-slate-900 text-sm leading-relaxed">
                              {consultation.notes}
                            </p>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => completeMutation.mutate(consultation.id)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(consultation.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Completed consultations */}
              {consultationsData.consultations.filter((c) => c.status === "completed").length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Completed Consultations</h3>
                  <div className="space-y-4">
                    {consultationsData.consultations
                      .filter((c) => c.status === "completed")
                      .map((consultation) => (
                        <div
                          key={consultation.id}
                          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 opacity-75"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-slate-900">
                                {consultation.patientName}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {consultation.doctorName} • {new Date(consultation.date).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-slate-900 text-sm leading-relaxed">
                              {consultation.notes}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Footer with count */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-6 py-4 mt-8">
                <p className="text-sm text-slate-600">
                  Total Consultations: <span className="font-semibold text-slate-900">{consultationsData.count}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
              <p className="text-slate-600 mb-4">No consultations available</p>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-gradient-to-r from-pink-600 to-pink-700"
              >
                <Plus className="w-4 h-4" />
                Create First Consultation
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

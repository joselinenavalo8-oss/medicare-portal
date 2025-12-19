import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorsResponse } from "@shared/api";

export default function Doctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Fetch doctors
  const { data, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await fetch("/api/doctors");
      return res.json() as Promise<DoctorsResponse>;
    },
  });

  // Filter doctors
  const filteredDoctors = data?.doctors.filter((doctor) => {
    const matchesSearch =
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties
  const specialties = [...new Set(data?.doctors.map((d) => d.specialty) || [])];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-medical-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Médicos</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search by name or specialty
              </label>
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-600"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="md:col-span-3 text-center py-12 text-slate-600">
              Loading doctors...
            </div>
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all hover:border-medical-200"
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Dr. {doctor.lastName}
                  </h3>
                  <p className="text-sm text-slate-600">{doctor.firstName}</p>
                </div>

                {/* Specialty Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {doctor.specialty}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="text-sm text-slate-900 break-all">{doctor.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="text-sm text-slate-900">{doctor.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600">Experience</p>
                      <p className="text-sm text-slate-900">
                        {doctor.yearsOfExperience} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600">License</p>
                      <p className="text-sm text-slate-900">{doctor.licenseNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => navigate(`/appointments?doctorId=${doctor.id}`)}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700"
                >
                  Schedule Appointment
                </Button>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 text-center py-12">
              <p className="text-slate-600 mb-4">No doctors found</p>
            </div>
          )}
        </div>

        {/* Footer with count */}
        {data && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredDoctors?.length || 0}</span> of{" "}
              <span className="font-semibold text-slate-900">{data.count}</span> doctors
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

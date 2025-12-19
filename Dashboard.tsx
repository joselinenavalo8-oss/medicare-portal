import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PatientsResponse,
  AppointmentsResponse,
  DoctorsResponse,
  HistoryResponse,
  QuickConsultationsResponse,
} from "@shared/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType] = useState<"doctor" | "triage">("doctor");

  // Fetch real-time data
  const { data: patientsData } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      return res.json() as Promise<PatientsResponse>;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      return res.json() as Promise<AppointmentsResponse>;
    },
    refetchInterval: 5000,
  });

  const { data: consultationsData } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const res = await fetch("/api/consultations");
      return res.json() as Promise<QuickConsultationsResponse>;
    },
    refetchInterval: 5000,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await fetch("/api/doctors");
      return res.json() as Promise<DoctorsResponse>;
    },
  });

  const { data: historyData } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch("/api/history");
      return res.json() as Promise<HistoryResponse>;
    },
    refetchInterval: 5000,
  });

  const menuItems = [
    {
      id: "patients",
      icon: Users,
      title: "Registro de Pacientes",
      description: "Manage patient records and information",
      color: "from-blue-600 to-blue-700",
      path: "/patients",
      count: patientsData?.count ?? 0,
    },
    {
      id: "appointments",
      icon: Calendar,
      title: "Citas",
      description: "Schedule and manage appointments",
      color: "from-green-600 to-green-700",
      path: "/appointments",
      count: appointmentsData?.count ?? 0,
    },
    {
      id: "doctors",
      icon: Stethoscope,
      title: "Médicos",
      description: "View and manage doctor information",
      color: "from-purple-600 to-purple-700",
      path: "/doctors",
      count: doctorsData?.count ?? 0,
    },
    {
      id: "history",
      icon: FileText,
      title: "Historial Clínico",
      description: "Access clinical history and records",
      color: "from-amber-600 to-amber-700",
      path: "/history",
      count: historyData?.count ?? 0,
    },
    {
      id: "quick",
      icon: Zap,
      title: "Consultas Rápidas",
      description: "Quick consultations and notes",
      color: "from-pink-600 to-pink-700",
      path: "/quick-consultations",
      count: consultationsData?.count ?? 0,
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Calculate today's consultations (active only)
  const todaysConsultations = consultationsData?.consultations.filter((c) => {
    const consultationDate = new Date(c.date);
    const today = new Date();
    return (
      consultationDate.toDateString() === today.toDateString() &&
      c.status === "active"
    );
  }).length ?? 0;

  // Calculate scheduled appointments for today
  const scheduledAppointments = appointmentsData?.appointments.filter((a) => {
    const appointmentDate = new Date(a.dateTime);
    const today = new Date();
    return (
      appointmentDate.toDateString() === today.toDateString() &&
      a.status === "scheduled"
    );
  }).length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-medical-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-medical-600 to-medical-700 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MediCare</h1>
              <p className="text-xs text-slate-500 capitalize">
                {userType === "doctor" ? "Doctor" : "Triage"} Portal
              </p>
            </div>
          </div>

          {/* Desktop Menu Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="text-slate-900 font-medium capitalize">
                {userType === "doctor" ? "Dr. Smith" : "Triage Officer"}
              </p>
              <p className="text-slate-500 text-xs">
                {userType === "doctor"
                  ? "doctor@hospital.com"
                  : "triage@hospital.com"}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.path)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-medical-600" />
                      <span className="font-medium text-slate-900">
                        {item.title}
                      </span>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  </button>
                );
              })}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {userType === "doctor" ? "Dr. Smith" : "Triage Officer"}!
          </h2>
          <p className="text-slate-600">
            Access key healthcare management tools and patient information
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-slate-100 hover:border-medical-200 text-left"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4">
                    {item.description}
                  </p>

                  {/* Count Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {item.count > 0 && `${item.count} item${item.count !== 1 ? 's' : ''}`}
                    </span>
                    <div className="w-8 h-8 bg-slate-100 group-hover:bg-medical-100 rounded-lg flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-medical-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-1">Active Patients</p>
            <p className="text-4xl font-bold text-slate-900">
              {patientsData?.count ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-2">Total registered</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-1">Scheduled Appointments</p>
            <p className="text-4xl font-bold text-slate-900">
              {appointmentsData?.count ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {scheduledAppointments} today
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-1">Active Consultations</p>
            <p className="text-4xl font-bold text-slate-900">
              {consultationsData?.count ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {todaysConsultations} active today
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

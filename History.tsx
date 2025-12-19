import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HistoryResponse } from "@shared/api";

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch clinical history
  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch("/api/history");
      return res.json() as Promise<HistoryResponse>;
    },
  });

  // Filter history
  const filteredHistory = data?.history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.patientName.toLowerCase().includes(searchLower) ||
      item.diagnosis.toLowerCase().includes(searchLower) ||
      item.doctorName.toLowerCase().includes(searchLower)
    );
  });

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
          <h1 className="text-2xl font-bold text-slate-900">
            Historial Clínico
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by patient name, diagnosis, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50"
            />
          </div>
        </div>

        {/* History Records */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-slate-600">
              Loading clinical history...
            </div>
          ) : filteredHistory && filteredHistory.length > 0 ? (
            <>
              {filteredHistory.map((record, index) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {record.patientName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Dr. {record.doctorName.replace("Dr. ", "")} • {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      Record #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                        Diagnosis
                      </p>
                      <p className="text-slate-900">{record.diagnosis}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                        Treatment
                      </p>
                      <p className="text-slate-900">{record.treatment}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-slate-900">{record.notes}</p>
                    </div>

                    <div className="pt-2 text-xs text-slate-500 text-right">
                      Recorded: {new Date(record.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer with count */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-6 py-4 mt-8">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{filteredHistory.length}</span> of{" "}
                  <span className="font-semibold text-slate-900">{data?.count}</span> clinical records
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
              <p className="text-slate-600">
                {searchTerm ? "No records found matching your search" : "No clinical history available"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

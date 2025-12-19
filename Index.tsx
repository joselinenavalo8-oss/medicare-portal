import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"doctor" | "triage">("doctor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log({
        email,
        password,
        userType,
      });
      // In a real app, you would authenticate here
      setIsLoading(false);
      // Navigate to dashboard after successful login
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-medical-100 rounded-full opacity-10 blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-medical-200 rounded-full opacity-10 blur-3xl -ml-32 -mb-32"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-medical-600 to-medical-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MediCare</h1>
          <p className="text-slate-600">Healthcare Professional Portal</p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Login as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("doctor")}
                className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  userType === "doctor"
                    ? "bg-medical-600 text-white shadow-lg shadow-medical-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <User className="w-4 h-4" />
                Doctor
              </button>
              <button
                type="button"
                onClick={() => setUserType("triage")}
                className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  userType === "triage"
                    ? "bg-medical-600 text-white shadow-lg shadow-medical-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <User className="w-4 h-4" />
                Triage
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-medical-600/30 hover:shadow-lg hover:shadow-medical-700/40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="px-3 text-xs text-slate-500">Demo Access</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 space-y-1 border border-slate-100">
            <p className="font-semibold text-slate-700 mb-2">
              {userType === "doctor" ? "Doctor" : "Triage"} Demo:
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {userType === "doctor" ? "doctor@hospital.com" : "triage@hospital.com"}
            </p>
            <p>
              <span className="font-medium">Password:</span> demo123
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>
            Secure healthcare provider login system
            <br />
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}

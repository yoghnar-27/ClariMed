import React, { useState } from "react";
import { UserPlus, Lock, Mail, User as UserIcon, ArrowLeft, Globe, ShieldCheck } from "lucide-react";
import { AuthResponse } from "../types";
import CareSaathiLogo from "../components/CareSaathiLogo";
import { LanguageCode, translations } from "../translations";

interface RegisterProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onRegisterSuccess: (user: any, token: string) => void;
  navigateToLogin: () => void;
}

export default function Register({
  language,
  onLanguageChange,
  onRegisterSuccess,
  navigateToLogin,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const t = translations[language] || translations["en"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(t.validationError);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data: AuthResponse = await response.json();
        if (data.success && data.user && data.token) {
          setSuccessMsg("Profile registered successfully!");
          setTimeout(() => {
            onRegisterSuccess(data.user, data.token!);
          }, 800);
        } else {
          setError(data.message || "Registration failed.");
        }
      } else {
        // Fallback demo register
        const demoUser = {
          id: "local-user-" + Date.now(),
          name,
          email,
          createdAt: new Date().toISOString(),
          patientId: "CS-P" + Math.floor(100000 + Math.random() * 900000),
          role: "patient",
          plan: "free"
        };
        onRegisterSuccess(demoUser, "local-token-" + Date.now());
      }
    } catch (err) {
      const demoUser = {
        id: "local-user-" + Date.now(),
        name,
        email,
        createdAt: new Date().toISOString(),
        patientId: "CS-P" + Math.floor(100000 + Math.random() * 900000),
        role: "patient",
        plan: "free"
      };
      onRegisterSuccess(demoUser, "local-token-" + Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 relative">
      {/* Language Toggle */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-white border border-slate-300 rounded-full px-3 py-1.5 shadow-sm">
        <Globe className="w-4 h-4 text-teal-700" />
        <span className="text-xs font-semibold text-slate-700 mr-1">भाषा:</span>
        {[
          { code: "en", name: "English" },
          { code: "hi", name: "हिन्दी" },
          { code: "te", name: "తెలుగు" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code as LanguageCode)}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              language === lang.code
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <CareSaathiLogo className="w-14 h-14 mb-2" />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.createAccountTitle}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xs">
            Join Care Saathi to understand medical reports and keep health records organized.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.fullName}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar / Sita Devi"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.emailAddress}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="phone or email"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-800">
            <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span>Secure digital health record. Organized for village and primary health center consultations.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>पंजीकरण हो रहा है...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t.createAccountBtn}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={navigateToLogin}
            className="text-xs font-bold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.alreadyHaveAccount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

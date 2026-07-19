import React, { useState } from "react";
import { UserPlus, Lock, Mail, User as UserIcon, ArrowLeft, Globe } from "lucide-react";
import { AuthResponse } from "../types";
import ClariMedLogo from "../components/ClariMedLogo";
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
          setSuccessMsg("Account created successfully!");
          setTimeout(() => {
            onRegisterSuccess(data.user, data.token!);
          }, 1200);
        } else {
          setError(data.message || "Registration failed.");
        }
      } else {
        setError("Unable to connect to registration services. Please try again in a few seconds.");
      }
    } catch (err) {
      console.warn("Registration fetch warning:", err);
      setError("Server connection failed. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-slate-50 via-teal-50/10 to-indigo-50/10 relative overflow-hidden">
      {/* Aesthetic glow accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-[120px] pointer-events-none" />

      {/* Language Toggle floating in top-right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full p-1 shadow-sm">
        <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
        {[
          { code: "en", name: "EN" },
          { code: "hi", name: "हि" },
          { code: "te", name: "తె" },
          { code: "ta", name: "த" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code as LanguageCode)}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              language === lang.code
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md premium-card p-8 md:p-10 bg-white/80 backdrop-blur-md relative z-10">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <ClariMedLogo className="w-16 h-16 mb-4" />
          <h1 id="register-heading" className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            {t.brandName}
          </h1>
          <p className="text-slate-500 mt-3 text-center text-sm font-sans leading-relaxed max-w-xs font-light">
            Create your secure health account and begin clarifying medical reports instantly.
          </p>
        </div>

        {/* Error Message banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message banner */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t.fullName}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="register-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm font-sans"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t.emailAddress}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="register-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm font-sans"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="register-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm font-sans"
                required
              />
            </div>
          </div>

          <button
            id="register-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white rounded-2xl py-3.5 px-4 font-semibold text-sm transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up secure account...
              </span>
            ) : (
              <>
                <span>{t.createAccountBtn}</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation back to Login */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>{t.alreadyHaveAccount}</span>
          <button
            id="register-goto-login-btn"
            onClick={navigateToLogin}
            className="text-teal-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer font-sans text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

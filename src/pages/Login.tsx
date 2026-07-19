import React, { useState } from "react";
import { LogIn, Lock, Mail, ArrowRight, Globe, Sparkles } from "lucide-react";
import { AuthResponse } from "../types";
import ClariMedLogo from "../components/ClariMedLogo";
import { LanguageCode, translations } from "../translations";

interface LoginProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onLoginSuccess: (user: any, token: string) => void;
  navigateToRegister: () => void;
}

export default function Login({
  language,
  onLanguageChange,
  onLoginSuccess,
  navigateToRegister,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Simulated Google Sign-In popup states
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("user.clarimed@gmail.com");
  const [googleName, setGoogleName] = useState("Alex Mercer");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t.validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.message || "Failed to log in.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleName) return;

    setIsGoogleLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleEmail, name: googleName }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        setIsGoogleModalOpen(false);
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.message || "Google auth failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed during Google Sign-In.");
    } finally {
      setIsGoogleLoading(false);
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
          <h1 id="login-heading" className="text-3xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            {t.brandName}
          </h1>
          <p className="text-slate-500 mt-3 text-center text-sm font-sans leading-relaxed max-w-xs font-light">
            {t.premiumPlanDesc}
          </p>
        </div>

        {/* Error Message banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full mb-6 border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 rounded-2xl py-3 px-4 font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {/* Flat Google vector icon */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t.continueWithGoogle}</span>
        </button>

        {/* Separator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">or</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t.emailAddress}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="login-email-input"
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.password}
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm font-sans"
                required
              />
            </div>
          </div>

          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white rounded-2xl py-3.5 px-4 font-semibold text-sm transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Accessing secure servers...
              </span>
            ) : (
              <>
                <span>{t.signInBtn}</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation to Register */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>{t.dontHaveAccount}</span>
          <button
            id="login-goto-register-btn"
            onClick={navigateToRegister}
            className="text-teal-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer font-sans"
          >
            <span>{t.createAccountBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Google Account Selector Popup Simulator */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200 p-6 font-sans">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="text-md font-bold text-slate-800">Sign in with Google</h3>
              <p className="text-xs text-slate-500 mt-1">to continue to ClariMed</p>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Google Email</label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs py-2.5 px-3 rounded-xl transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs py-2.5 px-3 rounded-xl transition-all outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs py-2.5 px-4 rounded-xl font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGoogleLoading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs py-2.5 px-4 rounded-xl font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  {isGoogleLoading ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Authorize"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

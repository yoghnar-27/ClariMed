import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { User } from "./types";
import { LanguageCode } from "./translations";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"login" | "register" | "dashboard">("login");
  const [appLoading, setAppLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("en");

  // Initialize session and language from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("care_saathi_user") || localStorage.getItem("clarimed_user");
      const savedToken = localStorage.getItem("care_saathi_token") || localStorage.getItem("clarimed_token");
      const savedLang = (localStorage.getItem("care_saathi_lang") || localStorage.getItem("clarimed_lang")) as LanguageCode;

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("login");
      }

      if (savedLang && ["en", "hi", "te"].includes(savedLang)) {
        setLanguage(savedLang);
      } else {
        setLanguage("en");
      }
    } catch (e) {
      console.error("Session restoration error:", e);
    } finally {
      setAppLoading(false);
    }
  }, []);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    localStorage.setItem("care_saathi_lang", newLang);
  };

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    localStorage.setItem("care_saathi_user", JSON.stringify(loggedInUser));
    localStorage.setItem("care_saathi_token", sessionToken);
    setUser(loggedInUser);
    setToken(sessionToken);
    setCurrentPage("dashboard");
  };

  const handleRegisterSuccess = (newUser: User, sessionToken: string) => {
    localStorage.setItem("care_saathi_user", JSON.stringify(newUser));
    localStorage.setItem("care_saathi_token", sessionToken);
    setUser(newUser);
    setToken(sessionToken);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("care_saathi_user");
    localStorage.removeItem("care_saathi_token");
    localStorage.removeItem("clarimed_user");
    localStorage.removeItem("clarimed_token");
    setUser(null);
    setToken(null);
    setCurrentPage("login");
  };

  if (appLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-700">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-base font-bold tracking-tight text-slate-800">CARE SAATHI</span>
        <span className="text-xs text-slate-500 mt-1">AI-Powered Healthcare Access & Continuity Platform</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300">
      {currentPage === "login" && (
        <Login
          language={language}
          onLanguageChange={handleLanguageChange}
          onLoginSuccess={handleLoginSuccess}
          navigateToRegister={() => setCurrentPage("register")}
        />
      )}
      {currentPage === "register" && (
        <Register
          language={language}
          onLanguageChange={handleLanguageChange}
          onRegisterSuccess={handleRegisterSuccess}
          navigateToLogin={() => setCurrentPage("login")}
        />
      )}
      {currentPage === "dashboard" && user && token && (
        <Dashboard
          user={user}
          token={token}
          language={language}
          onLanguageChange={handleLanguageChange}
          onUserUpdate={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem("care_saathi_user", JSON.stringify(updatedUser));
          }}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

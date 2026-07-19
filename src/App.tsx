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
      const savedUser = localStorage.getItem("clarimed_user");
      const savedToken = localStorage.getItem("clarimed_token");
      const savedLang = localStorage.getItem("clarimed_lang") as LanguageCode;

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
    localStorage.setItem("clarimed_lang", newLang);
  };

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    localStorage.setItem("clarimed_user", JSON.stringify(loggedInUser));
    localStorage.setItem("clarimed_token", sessionToken);
    setUser(loggedInUser);
    setToken(sessionToken);
    setCurrentPage("dashboard");
  };

  const handleRegisterSuccess = (newUser: User, sessionToken: string) => {
    localStorage.setItem("clarimed_user", JSON.stringify(newUser));
    localStorage.setItem("clarimed_token", sessionToken);
    setUser(newUser);
    setToken(sessionToken);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("clarimed_user");
    localStorage.removeItem("clarimed_token");
    setUser(null);
    setToken(null);
    setCurrentPage("login");
  };

  if (appLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex flex-col items-center justify-center text-slate-600">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide">Initializing ClariMed AI...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] transition-all duration-300">
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
            localStorage.setItem("clarimed_user", JSON.stringify(updatedUser));
          }}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}


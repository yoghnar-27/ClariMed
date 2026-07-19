import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Volume2,
  VolumeX,
  Languages,
  Clock,
  Trash2,
  LogOut,
  Sparkles,
  FileText,
  AlertCircle,
  Play,
  Pause,
  Square,
  User,
  CheckCircle,
  Heart,
  Stethoscope,
  MessageSquare,
  Send
} from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";
import { User as UserType, Analysis } from "../types";
import ClariMedLogo from "../components/ClariMedLogo";

import { LanguageCode, translations } from "../translations";

interface DashboardProps {
  user: UserType;
  token: string;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onUserUpdate: (updatedUser: UserType) => void;
  onLogout: () => void;
}

const CLINICAL_MESSAGES = [
  "Digitizing your report utilizing advanced multi-modal vision systems...",
  "Claria is decoding clinical medical terms into standard vocabulary...",
  "Formatting values and analyzing reference intervals safely...",
  "DRAFTING warm, empathetic, simple-language paragraphs for you...",
  "Almost ready! Preparing the spoken narrative with Claria's friendly voice..."
];

export default function Dashboard({ user, token, language, onLanguageChange, onUserUpdate, onLogout }: DashboardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Elderly easy-assist mode state (initialized from localStorage)
  const [isElderlyMode, setIsElderlyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("clarimed_elderly_mode") === "true";
    } catch {
      return false;
    }
  });

  // Claria Interactive Chat states
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "model"; text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  // Subscription states
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your Premium subscription? Your plan will return to the Free tier immediately.")) return;
    
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.user) {
        onUserUpdate(data.user);
        alert("Subscription canceled successfully. You are now on the Free tier.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to cancel subscription.");
    }
  };

  const handleUpgradeToPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholderName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvc.trim()) {
      setPaymentError("Please fill out all payment fields.");
      return;
    }
    
    setIsSubmittingPayment(true);
    setPaymentError("");

    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod: "visa",
          cardNumber
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onUserUpdate(data.user);
        setIsSubscriptionModalOpen(false);
        setCardholderName("");
        setCardNumber("");
        setExpiryDate("");
        setCvc("");
      } else {
        setPaymentError(data.message || "Upgrade failed. Please check your card info and try again.");
      }
    } catch (err) {
      console.error(err);
      setPaymentError("Network error. Failed to upgrade.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Hook for voice narration
  const speech = useSpeech();

  // Load user report history on startup
  useEffect(() => {
    fetchHistory();
  }, []);

  // Sync active analysis with chat introduction & auto voice-assist
  const lastReadAnalysisIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeAnalysis) {
      // Setup the warm welcoming message in the native language
      const tSet = translations[activeAnalysis.language] || translations["en"];
      setChatHistory([
        {
          role: "model",
          text: tSet.chatIntroduction
        }
      ]);

      // If elderly mode is ON, automatically trigger audio reading once
      if (isElderlyMode && lastReadAnalysisIdRef.current !== activeAnalysis.id) {
        lastReadAnalysisIdRef.current = activeAnalysis.id;
        const timer = setTimeout(() => {
          speech.speak(activeAnalysis.explanation, activeAnalysis.language);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setChatHistory([]);
      lastReadAnalysisIdRef.current = null;
    }
  }, [activeAnalysis, isElderlyMode]);

  // Handle submitting Q&A messages to Claria
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeAnalysis || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatError("");
    setIsChatLoading(true);

    const updatedHistory = [...chatHistory, { role: "user" as const, text: userText }];
    setChatHistory(updatedHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          analysisId: activeAnalysis.id,
          messages: updatedHistory,
          language: activeAnalysis.language
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const clariaReply = data.reply;
        setChatHistory(prev => [...prev, { role: "model" as const, text: clariaReply }]);
        
        // Auto-read Claria's answer if easy mode is active
        if (isElderlyMode) {
          speech.speak(clariaReply, activeAnalysis.language);
        }
      } else {
        setChatError(data.message || "Could not retrieve answer. Please try again.");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatError("Network error. Claria is currently offline.");
    } finally {
      setIsChatLoading(false);
    }
  };

  // Cycle through comforting clinical messages on upload
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % CLINICAL_MESSAGES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Invalid file type. Please upload a PDF, PNG, or JPEG report.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select or drop a medical report first.");
      return;
    }

    const multilingualCount = history.filter(item => item.language && item.language !== "en").length;
    const hasUsedMultilingual = multilingualCount >= 1;

    // Client-side limits checks for Free plan
    if (user.plan !== "premium") {
      if (history.length >= 2) {
        setError("You have reached your limit of 2 reports on the Free plan. Upgrade to Premium for unlimited medical report analyses and insights!");
        setIsSubscriptionModalOpen(true);
        return;
      }

      if (language !== "en" && hasUsedMultilingual) {
        setError("You have already used your 1 free multilingual translation. Please subscribe to Premium to unlock unlimited Hindi, Telugu, and Tamil translations!");
        setIsSubscriptionModalOpen(true);
        return;
      }
    }

    setIsAnalyzing(true);
    setError("");
    setLoadingMessageIndex(0);
    speech.stop(); // Stop any active reading

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setActiveAnalysis(data.analysis);
        setFile(null);
        // Refresh the list
        fetchHistory();
      } else {
        if (data.isLimitReached || data.isLanguageLocked) {
          setIsSubscriptionModalOpen(true);
        }
        setError(data.message || "Failed to analyze report. Please try a cleaner image or PDF.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Make sure your server is online.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid loading the record when deleting
    if (!confirm("Are you sure you want to delete this historical analysis record?")) return;

    try {
      const res = await fetch(`/api/delete-analysis/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        if (activeAnalysis?.id === id) {
          setActiveAnalysis(null);
          speech.stop();
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLoadHistoryItem = (item: Analysis) => {
    setActiveAnalysis(item);
    speech.stop(); // Stop current speech
  };

  const handleTriggerSpeech = () => {
    if (!activeAnalysis) return;
    speech.speak(activeAnalysis.explanation, activeAnalysis.language);
  };

  // Human language helper strings
  const getLanguageLabel = (langCode: string) => {
    const labels: Record<string, string> = {
      en: "English Narrative",
      hi: "Hindi (हिंदी) अनुवाद",
      te: "Telugu (తెలుగు) अनुवाद",
      ta: "Tamil (தமிழ்) अनुवाद"
    };
    return labels[langCode] || langCode;
  };

  const t = translations[language];

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isElderlyMode ? "bg-slate-50/50" : ""}`}>
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <ClariMedLogo className="w-10 h-10" />
          <div>
            <h1 id="app-logo-text" className="text-xl font-bold font-display text-slate-900 flex items-center gap-2 tracking-tight">
              {t.brandName} <span className="text-xs px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full font-semibold border border-teal-100">{t.clinicalEngine}</span>
            </h1>
            <p className="text-xs text-slate-500">{t.brandSubtitle}</p>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-700">{t.welcomeBack} {user.name}</span>
          </div>
          <button
            id="logout-button"
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors text-xs font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </header>

      {/* Elderly Easy-Assist Mode Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md transition-all border-b border-amber-600">
        <div className="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-inner flex-shrink-0 animate-[bounce_2s_infinite]">👵</div>
          <div>
            <h4 className="text-sm font-black flex items-center gap-2 justify-center md:justify-start">
              <span>{t.assistModeToggle}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide ${isElderlyMode ? "bg-white text-amber-700" : "bg-white/20 text-white"}`}>
                {isElderlyMode ? t.elderlyModeOn : t.elderlyModeOff}
              </span>
            </h4>
            <p className="text-xs text-amber-50 font-medium max-w-xl mt-0.5">{t.assistModeDesc}</p>
          </div>
        </div>
        <button
          onClick={() => {
            const nextMode = !isElderlyMode;
            setIsElderlyMode(nextMode);
            localStorage.setItem("clarimed_elderly_mode", String(nextMode));
            if (nextMode) {
              speech.speak("Assistant mode is now on. The text is now larger and I will automatically read explanations for you.", language);
            } else {
              speech.stop();
            }
          }}
          className="bg-white text-slate-900 hover:bg-amber-50 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider uppercase shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>{isElderlyMode ? "👵 Turn Off Easy Mode" : "👵 Turn On Easy Mode"}</span>
        </button>
      </div>

      {/* 2. Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls, Upload, Language & History (5/12 widths) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Plan & Usage Widget */}
          <div className="premium-card p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col gap-4 relative overflow-hidden">
            {/* Background decorative gradients */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-50 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${user.plan === 'premium' ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {user.plan === 'premium' ? <Sparkles className="w-4 h-4 fill-amber-300" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-800">
                      {user.plan === 'premium' ? t.premiumSubscription : t.freePlan}
                    </span>
                    {user.plan === 'premium' && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 font-bold rounded-md uppercase border border-amber-500/20">
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Account status & usage limits</p>
                </div>
              </div>

              {user.plan === 'premium' ? (
                <button
                  onClick={handleCancelSubscription}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  {t.cancelSubscription}
                </button>
              ) : (
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 fill-amber-200" /> {t.upgradeToPremium}
                </button>
              )}
            </div>

            {/* Credit usage meter */}
            <div className="z-10 bg-slate-50 border border-slate-100/50 rounded-2xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t.analysisUsageLimit}:</span>
                <span className="font-bold text-slate-800">
                  {user.plan === 'premium' ? t.unlimited : `${history.length} of 2 ${t.usedOfTotal}`}
                </span>
              </div>
              
              {user.plan !== 'premium' ? (
                <div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${history.length >= 2 ? 'bg-rose-500' : 'bg-teal-500'}`}
                      style={{ width: `${Math.min(100, (history.length / 2) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    {t.usageLimitAlert.replace("{used}", history.length.toString()).replace("{total}", "2")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>You have unlimited premium analysis capabilities. Thank you for subscribing!</span>
                </div>
              )}
            </div>
          </div>
          
          {/* A. Upload Medical Report Box */}
          <div className="premium-card p-6 bg-white">
            <h2 id="upload-panel-heading" className="text-lg font-bold font-display text-slate-800 flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-teal-600" />
              <span>{t.uploadClinicalReport}</span>
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Drag-and-drop region */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("report-file-picker")?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-teal-400 bg-teal-50/50"
                    : file
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/50"
                }`}
              >
                <input
                  key={file ? file.name : "empty"}
                  id="report-file-picker"
                  type="file"
                  onChange={handleFileChange}
                  accept=".png, .jpg, .jpeg, .pdf"
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-xs mx-auto">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to change
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {t.dragDropOr}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.supportsFileTypes}
                    </p>
                  </div>
                )}
              </div>

              {/* Language Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.narrativeLanguage}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { code: "en", name: "English", isFree: true },
                    { code: "hi", name: "Hindi", isFree: false },
                    { code: "te", name: "Telugu", isFree: false },
                    { code: "ta", name: "Tamil", isFree: false }
                  ].map((lang) => {
                    const multilingualCount = history.filter(item => item.language && item.language !== "en").length;
                    const hasUsedMultilingual = multilingualCount >= 1;
                    const isLocked = !lang.isFree && hasUsedMultilingual && user.plan !== "premium";

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            setIsSubscriptionModalOpen(true);
                          } else {
                            onLanguageChange(lang.code as LanguageCode);
                          }
                        }}
                        className={`relative py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          language === lang.code
                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                            : isLocked
                            ? "bg-slate-50 text-slate-400 border-slate-200/60 hover:border-amber-300"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-teal-50/30"
                        }`}
                      >
                        <span>{lang.name}</span>
                        {isLocked && (
                          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/30 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {user.plan !== "premium" && (
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 leading-relaxed">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>
                      {history.filter(item => item.language && item.language !== "en").length >= 1
                        ? "You have used your 1 free translation. Upgrade to Premium for unlimited multilingual translations!"
                        : t.multilingualPremiumFeature}
                    </span>
                  </p>
                )}
              </div>

              {/* Submit / Analyze button */}
              <button
                id="analyze-submit-button"
                type="submit"
                disabled={isAnalyzing}
                className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white rounded-2xl py-3.5 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.aiParsing}
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 text-amber-300 fill-amber-300" />
                    <span>{t.clarifyWithGemini}</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Feedback */}
            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* B. Voice Assistant Panel (Claria Controller) */}
          {activeAnalysis && (
            <div className="premium-card p-6 bg-gradient-to-br from-indigo-50/40 via-white to-teal-50/20 border border-indigo-100/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-indigo-100/80 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold font-display text-slate-800">Claria Voice Assistant</h3>
                    <p className="text-xs text-slate-500">Natural Language Healthcare voice</p>
                  </div>
                </div>

                {/* Animated sound wave bars when active speaking */}
                {speech.isSpeaking && !speech.isPaused && (
                  <div className="flex gap-0.5 items-end h-6">
                    <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
                    <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_300ms] h-5" />
                    <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_200ms] h-2" />
                    <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_400ms] h-4" />
                  </div>
                )}
              </div>

              {/* Spoken subtitle highlight */}
              {speech.spokenSentence ? (
                <div className="bg-white/80 p-3.5 rounded-2xl border border-indigo-100/30 text-xs text-slate-600 italic mb-4 leading-relaxed min-h-[50px] shadow-sm">
                  💬 "{speech.spokenSentence}"
                </div>
              ) : (
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Let Claria read the explanation aloud in a comforting, professional voice. Supported in English, Hindi, Telugu, and Tamil.
                </p>
              )}

              {/* Speeches player controls */}
              <div className="flex gap-3 justify-center">
                {!speech.isSpeaking ? (
                  <button
                    onClick={handleTriggerSpeech}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-5 text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Speak Explanation</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {speech.isPaused ? (
                      <button
                        onClick={speech.resume}
                        className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-2 px-4 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    ) : (
                      <button
                        onClick={speech.pause}
                        className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl py-2 px-4 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    )}
                    <button
                      onClick={speech.stop}
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2 px-4 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* C. Historical Report Explorer */}
          <div className="premium-card p-6 bg-white flex-1 min-h-[250px] flex flex-col">
            <h2 id="history-panel-heading" className="text-md font-bold font-display text-slate-800 flex items-center gap-2 mb-4">
              <Clock className="w-4.5 h-4.5 text-slate-500" />
              <span>{t.reportHistory}</span>
            </h2>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <FileText className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
                <p className="text-xs font-medium">{t.noScannedReports}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2.5 pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadHistoryItem(item)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between group ${
                      activeAnalysis?.id === item.id
                        ? "bg-teal-50/50 border-teal-200"
                        : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate pr-2">
                        {item.reportName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-200/60 rounded text-slate-600 font-medium font-mono uppercase">
                          {item.language}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`delete-analysis-${item.id}`}
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Active Report Viewer (7/12 widths) */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px]">
          {isAnalyzing ? (
            /* Analysis loading state */
            <div className="premium-card p-12 bg-white flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 animate-spin border-4 border-slate-100 border-t-teal-500" />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-800 mb-2">Analyzing Medical Report</h3>
              <p className="text-sm text-slate-600 max-w-sm font-medium animate-pulse">
                {CLINICAL_MESSAGES[loadingMessageIndex]}
              </p>
              <p className="text-xs text-slate-400 mt-6 max-w-xs">
                Medical OCR is reading test values. Please stand by while Gemini crafts clean language paragraphs.
              </p>
            </div>
          ) : activeAnalysis ? (
            /* Active report visualization card */
            <div className="premium-card bg-white flex-1 p-6 md:p-8 flex flex-col">
              {/* Document Header details */}
              <div className="border-b border-slate-100 pb-5 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                    {getLanguageLabel(activeAnalysis.language)}
                  </span>
                  <h3 id="analysis-title-heading" className="text-2xl font-bold font-display text-slate-800 mt-2">
                    {activeAnalysis.reportName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Analyzed on {new Date(activeAnalysis.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerSpeech}
                    className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 px-4 rounded-xl text-xs font-semibold border border-indigo-100 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{t.listenToNarrative}</span>
                  </button>
                </div>
              </div>

              {/* Double Pane: Explanation + Raw values */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                {/* Section A: Claria's Soothing Narrative */}
                <div className="bg-gradient-to-tr from-teal-50/20 to-indigo-50/20 p-6 md:p-8 rounded-2xl border border-teal-100/50 space-y-4 shadow-sm">
                  <h4 className={`font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 ${isElderlyMode ? "text-lg" : "text-sm"}`}>
                    <Heart className="w-5 h-5 text-teal-600 fill-teal-600" />
                    <span>{t.patientFriendlyExplanation}</span>
                  </h4>
                  <div className={`space-y-5 text-slate-800 whitespace-pre-line font-medium leading-relaxed ${isElderlyMode ? "text-xl md:text-2xl font-bold leading-loose tracking-wide text-slate-950" : "text-sm md:text-md"}`}>
                    {activeAnalysis.explanation.split("\n\n").map((para, i) => (
                      <p key={i}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Section B: Interactive Q&A Chat with Claria (Real-time interactions) */}
                <div className="bg-white border-2 border-indigo-100/80 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm relative">
                  <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
                    <h4 className={`font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5 ${isElderlyMode ? "text-md" : "text-xs"}`}>
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span>{t.askClariaQuestion}</span>
                    </h4>
                    {chatHistory.length > 1 && (
                      <button
                        onClick={() => setChatHistory([{ role: "model", text: t.chatIntroduction }])}
                        className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold cursor-pointer"
                      >
                        {t.clearChat}
                      </button>
                    )}
                  </div>

                  {/* Message Bubble Log */}
                  <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 ${
                            msg.role === "user"
                              ? "bg-teal-600 text-white rounded-br-none text-left shadow-sm"
                              : "bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-none text-left shadow-sm"
                          } ${isElderlyMode ? "text-lg md:text-xl font-bold leading-relaxed" : "text-xs font-medium leading-relaxed"}`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                          {msg.role === "model" && (
                            <button
                              onClick={() => speech.speak(msg.text, activeAnalysis.language)}
                              className="mt-2 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{t.listen}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl rounded-bl-none p-3.5 text-xs font-semibold flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <span>{t.thinking}</span>
                        </div>
                      </div>
                    )}

                    {chatError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
                        {chatError}
                      </div>
                    )}
                  </div>

                  {/* Chat Input form */}
                  <form onSubmit={handleChatSubmit} className="flex gap-2.5 pt-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={t.askQuestionPlaceholder}
                      className={`flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 outline-none transition-all ${
                        isElderlyMode ? "py-4 text-md font-bold text-slate-900 shadow-sm" : "py-2.5 text-xs font-medium text-slate-700"
                      }`}
                      disabled={isChatLoading}
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all px-5 ${
                        isElderlyMode ? "text-md" : "text-xs"
                      }`}
                    >
                      <span>{t.askBtn}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Section C: Clinical Values Log */}
                <div className="p-5 border border-slate-100 rounded-2xl space-y-4">
                  <h4 className={`font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ${isElderlyMode ? "text-sm" : "text-xs"}`}>
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{t.extractedInsights}</span>
                  </h4>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed max-h-[180px] overflow-y-auto">
                      {activeAnalysis.rawText}
                    </pre>
                  </div>
                </div>

                {/* Section D: Safety Guard Disclaimer */}
                <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-800">{t.clinicalAnalysisResult}</h5>
                    <p className="text-[11px] text-amber-700/90 mt-1 leading-relaxed">
                      ClariMed uses Google Gemini AI to clarify medical terminology. Claria does not diagnose illnesses or recommend medications. Always discuss your laboratory measurements, scans, or clinical notes with a licensed healthcare practitioner or family doctor before making any medical decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Welcome Empty state */
            <div className="premium-card p-12 bg-white flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 text-white shadow-lg shadow-teal-500/10 animate-[pulse_3s_infinite]">
                <Stethoscope className="w-10 h-10" />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 fill-amber-300" />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-800 mb-2">{t.welcomeToClariMed}</h3>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-medium">
                {language === "hi" && "एक प्रयोगशाला रक्त परीक्षण, नुस्खा, स्कैन या नैदानिक ​​​​रिपोर्ट अपलोड करें। क्लैरिया जेमिनी का उपयोग करके मानों को ट्रांसक्राइब करेगी, और आपकी पसंद की भाषा में जोर से एक आसान-से-समझने योग्य स्पष्टीकरण देगी।"}
                {language === "te" && "ప్రయోగశాల రక్త పరీక్ష, ప్రిస్క్రిప్షన్, స్కాన్ లేదా రోగనిర్ధారణ నివేదికను అప్‌లోడ్ చేయండి. క్లారియా జెమినిని ఉపయోగించి విలువలను లిప్యంతరీకరిస్తుంది మరియు మీకు నచ్చిన భాషలో సులభంగా అర్థమయ్యే వివరణను బిగ్గరగా చదువుతుంది."}
                {language === "ta" && "இரத்த பரிசோதனை, மருந்துச்சீட்டு, ஸ்கேன் அல்லது நோயறிதல் அறிக்கையைப் பதிவேற்றவும். கிளாரியா ஜெமினியைப் பயன்படுத்தி மதிப்புகளைப் படியெடுத்து, உங்களுக்கு விருப்பமான மொழியில் எளிதாகப் புரிந்துகொள்ளக்கூடிய விளக்கத்தை உரக்கப் பேசும்."}
                {language === "en" && "Upload a laboratory blood test, prescription, scan, or diagnostic report. Claria will transcribe the values using Gemini, and speak an easy-to-understand explanation aloud in your language of choice."}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-left">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>State-of-the-Art OCR</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Unified multi-modal Gemini model instantly handles complex layouts, handwriting, and PDF structures.
                  </p>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-left">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Empathetic Speech</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Our voice generator, Claria, narrates the simplified results in comfortable paragraph scripts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 4. Subscription Checkout Modal */}
      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => {
                  setIsSubscriptionModalOpen(false);
                  setPaymentError("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  Upgrade Account
                </span>
              </div>
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{t.premiumPlanHeading}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.premiumPlanDesc}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Premium Value Props list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: "Unlimited Analyses", desc: "No file upload or usage credit caps" },
                  { title: "Multilingual Narrations", desc: "English, Hindi, Telugu, & Tamil translations" },
                  { title: "Empathetic Female Voice", desc: "Comforting tone tailored for health readings" },
                  { title: "Priority Processing", desc: "Instant response under high server loads" }
                ].map((prop, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1 text-left">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      {prop.title}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-relaxed">{prop.desc}</span>
                  </div>
                ))}
              </div>

              {/* Price Tag Box */}
              <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-800 font-semibold uppercase tracking-wider block">{t.pricingOffer}</span>
                  <span className="text-sm text-teal-600 font-medium">{t.cancelAnytime}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{t.pricePerMonth.split(" ")[0]}</span>
                  <span className="text-xs text-slate-500"> {t.pricePerMonth.substring(t.pricePerMonth.indexOf("/"))}</span>
                </div>
              </div>

              {/* Secure simulated payment checkout form */}
              <form onSubmit={handleUpgradeToPremium} className="space-y-4 text-left border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Secure Billing details</span>
                </h4>

                {paymentError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Jane Smith"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs py-2.5 px-3 rounded-xl transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
                          const matches = val.match(/\d{4,16}/g);
                          const match = (matches && matches[0]) || "";
                          const parts = [];

                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }

                          if (parts.length > 0) {
                            setCardNumber(parts.join(" "));
                          } else {
                            setCardNumber(val);
                          }
                        }}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs py-2.5 px-3 rounded-xl transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, "");
                          if (val.length >= 2) {
                            val = val.substring(0, 2) + "/" + val.substring(2, 4);
                          }
                          setExpiryDate(val);
                        }}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs py-2.5 px-3 rounded-xl transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVC Code</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs py-2.5 px-3 rounded-xl transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubscriptionModalOpen(false);
                      setPaymentError("");
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Keep Free Tier
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPayment}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmittingPayment ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 fill-amber-200" />
                        Subscribe Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

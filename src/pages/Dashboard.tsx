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
  Send,
  Camera,
  CameraOff
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

  // Camera access states & references
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.user) {
          onUserUpdate(data.user);
          alert("Subscription canceled successfully. You are now on the Free tier.");
        }
      } else {
        alert("Unable to cancel subscription. The server is currently busy. Please try again.");
      }
    } catch (err) {
      console.warn("Cancel subscription error:", err);
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

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
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
      } else {
        setPaymentError("Unable to upgrade subscription. The server is currently busy. Please try again.");
      }
    } catch (err) {
      console.warn("Upgrade subscription error:", err);
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
    return () => {
      // Cleanup camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync active analysis with auto voice-assist
  const lastReadAnalysisIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeAnalysis) {
      // Automatically trigger audio reading as soon as report is active/loaded
      if (lastReadAnalysisIdRef.current !== activeAnalysis.id) {
        lastReadAnalysisIdRef.current = activeAnalysis.id;
        const timer = setTimeout(() => {
          speech.speak(activeAnalysis.explanation, activeAnalysis.language);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      lastReadAnalysisIdRef.current = null;
    }
  }, [activeAnalysis]);

  // Camera helper methods
  const startCamera = async () => {
    setIsCameraActive(true);
    setError("");
    setFile(null); // Clear any pre-selected file
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Prioritize back camera for reports
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setError("Unable to access the device camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "camera_captured_report.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
            stopCamera();
          }
        }, "image/jpeg", 0.95);
      }
    }
  };

  // Instant on-the-fly report translation helper
  const handleTranslateReport = async (targetLang: LanguageCode, analysisId: string) => {
    try {
      setIsAnalyzing(true);
      setError("");
      speech.stop();

      const res = await fetch("/api/translate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          analysisId,
          language: targetLang
        })
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok && data.success && data.analysis) {
          // Update both active analysis AND last read reference so it reads automatically
          lastReadAnalysisIdRef.current = data.analysis.id;
          setActiveAnalysis(data.analysis);
          fetchHistory();
          
          // Let it speak immediately in the new language!
          setTimeout(() => {
            speech.speak(data.analysis.explanation, targetLang);
          }, 600);
        } else {
          if (data.isLanguageLocked) {
            setIsSubscriptionModalOpen(true);
          }
          setError(data.message || "Failed to translate report.");
        }
      } else {
        setError("Unable to connect to translation services. The server might be restarting. Please try again in a few seconds.");
      }
    } catch (err) {
      console.warn("Translation warning:", err);
      setError("Failed to translate the report narrative.");
    } finally {
      setIsAnalyzing(false);
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
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setHistory(data.history || []);
        }
      } else {
        console.warn("Failed to load history: Server returned non-JSON response or status", res.status);
      }
    } catch (err) {
      console.warn("Failed to load history:", err);
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

    const uploadLanguage = language;

    if (user.plan !== "premium") {
      if (history.length >= 2) {
        setError("You have reached your limit of 2 reports on the Free plan. Upgrade to Premium for unlimited medical report analyses and insights!");
        setIsSubscriptionModalOpen(true);
        return;
      }
    }

    setIsAnalyzing(true);
    setError("");
    setLoadingMessageIndex(0);
    speech.stop(); // Stop any active reading
    speech.prime(); // Prime/unlock the speech synthesis engine on direct user click gesture

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", uploadLanguage);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok && data.success && data.analysis) {
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
      } else {
        setError("Unable to process the report analysis. The server might be restarting or busy. Please try again in a few seconds.");
      }
    } catch (err) {
      console.warn("Analyze report error warning:", err);
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
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setHistory((prev) => prev.filter((item) => item.id !== id));
          if (activeAnalysis?.id === id) {
            setActiveAnalysis(null);
            speech.stop();
          }
        }
      }
    } catch (err) {
      console.warn("Delete warning:", err);
    }
  };

  const handleLoadHistoryItem = (item: Analysis) => {
    setActiveAnalysis(item);
    onLanguageChange(item.language);
    speech.stop(); // Stop current speech
    speech.prime(); // Prime the speech engine on user click gesture
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
      te: "Telugu (తెలుగు) अनुवाद"
    };
    return labels[langCode] || langCode;
  };

  const t = translations[language] || translations["en"];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/30">
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
              {isCameraActive ? (
                <div className="border-2 border-dashed border-teal-500 rounded-2xl p-4 bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden min-h-[260px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-48 object-cover rounded-xl bg-black"
                  />
                  <div className="flex gap-2.5 mt-3.5 z-10 w-full justify-center">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Scan</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <CameraOff className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
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

                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/20 text-slate-700 hover:text-teal-700 rounded-xl py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Camera className="w-4 h-4 text-teal-600" />
                    <span>Scan with Device Camera</span>
                  </button>
                </div>
              )}

              {/* Language Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.narrativeLanguage}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { code: "en", name: "English" },
                    { code: "hi", name: "Hindi" },
                    { code: "te", name: "Telugu" }
                  ].map((lang) => {
                    const isLocked = false;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            setIsSubscriptionModalOpen(true);
                          } else {
                            onLanguageChange(lang.code as LanguageCode);
                            speech.prime(); // Prime the speech engine immediately on user gesture
                            if (activeAnalysis) {
                              handleTranslateReport(lang.code as LanguageCode, activeAnalysis.id);
                            }
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
                      {t.multilingualPremiumFeature}
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
            <div className="premium-card bg-white flex-1 p-6 md:p-8 flex flex-col justify-between">
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
              </div>

              {/* Voice Centric Display (No Dense Text, Just clear audio feedback & player controls) */}
              <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-8">
                {/* Visual Speaking Status / Soundwaves */}
                <div className="relative flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    speech.isSpeaking && !speech.isPaused
                      ? "bg-teal-500/10 text-teal-600 animate-[pulse_1.5s_infinite]"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {speech.isSpeaking && !speech.isPaused ? (
                      <Volume2 className="w-14 h-14 animate-bounce" />
                    ) : (
                      <VolumeX className="w-14 h-14" />
                    )}
                  </div>
                  
                  {/* Subtle radiating sound wave rings */}
                  {speech.isSpeaking && !speech.isPaused && (
                    <>
                      <span className="absolute inset-0 rounded-full border-2 border-teal-500/30 animate-ping" />
                      <span className="absolute -inset-4 rounded-full border border-teal-500/15 animate-[ping_2s_infinite]" />
                    </>
                  )}
                </div>

                <div className="text-center max-w-md space-y-3">
                  <h4 className="text-lg font-bold text-slate-800">
                    {speech.isSpeaking 
                      ? speech.isPaused ? "Voice Explanation Paused" : "Listening to Claria's Voice Description..." 
                      : "Voice Explanation Ready"
                    }
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed px-4">
                    Claria is speaking in your selected language ({getLanguageLabel(activeAnalysis.language)}). Please sit back and listen to your simple, easy-to-understand explanation out loud.
                  </p>
                </div>

                {/* Highly Tactile Audio Controls */}
                <div className="flex items-center gap-4">
                  {!speech.isSpeaking ? (
                    <button
                      onClick={handleTriggerSpeech}
                      className="flex items-center gap-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3.5 px-8 text-sm font-bold shadow-md shadow-teal-600/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Listen to Report Description</span>
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      {speech.isPaused ? (
                        <button
                          onClick={speech.resume}
                          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3 px-6 text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Resume</span>
                        </button>
                      ) : (
                        <button
                          onClick={speech.pause}
                          className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white rounded-2xl py-3 px-6 text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </button>
                      )}
                      <button
                        onClick={speech.stop}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl py-3 px-6 text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Square className="w-4 h-4" />
                        <span>Stop</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Guard Disclaimer at the bottom */}
              <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-start gap-3 mt-6">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-800">{t.clinicalAnalysisResult}</h5>
                  <p className="text-[11px] text-amber-700/90 mt-1 leading-relaxed">
                    ClariMed uses Google Gemini AI to clarify medical terminology. Claria does not diagnose illnesses or recommend medications. Always discuss your laboratory measurements, scans, or clinical notes with a licensed healthcare practitioner or family doctor before making any medical decisions.
                  </p>
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
                  { title: "Multilingual Narrations", desc: "English, Hindi, & Telugu translations" },
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

import { useState, useEffect, useRef } from "react";

export interface UseSpeechResult {
  speak: (text: string, langCode: "en" | "hi" | "te" | "ta") => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  currentWordIndex: number;
  spokenSentence: string;
  availableVoices: SpeechSynthesisVoice[];
}

export function useSpeech(): UseSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spokenSentence, setSpokenSentence] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Load available system voices (handles async chrome load)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 2. Clear current utterance
  const stop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
      setSpokenSentence("");
    }
  };

  const pause = () => {
    if (typeof window !== "undefined" && window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (typeof window !== "undefined" && window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // 3. Trigger speech with optimal voice based on language selection
  const speak = (text: string, langCode: "en" | "hi" | "te" | "ta") => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    // Cancel any active speech first
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
    setSpokenSentence("");

    // Create dynamic utterance
    // Remove markdown symbols (asterisks, hashtags) to make speech seamless
    const cleanText = text
      .replace(/[*#_`~]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Resolve Language String mapping for browser TTS
    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      te: "te-IN",
      ta: "ta-IN",
    };
    utterance.lang = langMap[langCode] || "en-US";

    // Attempt to locate a native local voice of the requested language, prioritizing female voices
    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith(langCode) ||
        v.lang.toLowerCase().includes(langMap[langCode].toLowerCase())
    );

    // Heuristics for female voice names (cross-platform: macOS, iOS, Windows, Chrome, Android, Linux)
    const femaleKeywords = [
      // English
      "female", "zira", "samantha", "veena", "karen", "moira", "tessa", "susan", "hazel", "salli", 
      "joanna", "ivy", "kendra", "kimberly", "nicole", "victoria", "clara", "serena", "fiona", "melina", 
      "kyoko", "yuna", "sin-ji", "mei-jia", "ms", "mrs", "miss", "lady", "woman", "girl",
      
      // Hindi
      "google हिन्दी", "kalpana", "kalpana desktop", "microsoft kalpana", "heera", "ekta", "leela", 
      "riya", "neha", "nisha", "shweta", "swara", "priya", "kavya", "swati", "lata", "geeta", "anjali", 
      "pooja", "rani", "rekha", "jaya", "preeti", "shruti", "shruthi", "swara",
      
      // Telugu
      "shruti", "shruthi", "swara", "vani", "sandhya", "sravani", "padma", "vauhini", "harika", "ramya", 
      "lavanya", "divya", "kalyani",
      
      // Tamil
      "vani", "kavya", "priya", "uma", "kala", "latha", "lata", "meena", "anu", "chitra", "devi", 
      "jaya", "radha", "lakshmi", "selvi", "kokila", "saritha", "sabita", "lata", "asha", "sudha"
    ];

    const femaleVoice = langVoices.find((v) =>
      femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw) || v.voiceURI.toLowerCase().includes(kw))
    );

    const selectedVoice = femaleVoice || langVoices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Configure standard natural sounding healthcare assistant pace and pitch
    utterance.rate = 0.95; // Slightly slower for crisp clarity
    utterance.pitch = 1.05; // Slightly warmer pitch

    // Track speech events
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
      setSpokenSentence("");
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // Sentence tracking / boundary detection
    utterance.onboundary = (event) => {
      if (event.name === "sentence") {
        // Find sentence segment
        const segment = cleanText.substring(event.charIndex);
        const nextPeriod = segment.search(/[.!?]/);
        const sentence = nextPeriod !== -1 ? segment.substring(0, nextPeriod + 1) : segment;
        setSpokenSentence(sentence);
      } else if (event.name === "word") {
        setCurrentWordIndex(event.charIndex);
      }
    };

    // Speak!
    window.speechSynthesis.speak(utterance);
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    currentWordIndex,
    spokenSentence,
    availableVoices,
  };
}

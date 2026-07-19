import { useState, useEffect, useRef } from "react";

export interface UseSpeechResult {
  speak: (text: string, langCode: "en" | "hi" | "te") => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  prime: () => void;
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
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const sentenceChunksRef = useRef<string[]>([]);
  const currentSentenceIndexRef = useRef<number>(0);
  const activeLangCodeRef = useRef<"en" | "hi" | "te">("en");

  // Load available system voices (handles async chrome load)
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
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
    };
  }, []);

  // Prime function to "unlock" audio contexts on user gesture
  const prime = () => {
    if (typeof window !== "undefined") {
      if (window.speechSynthesis) {
        try {
          const u = new SpeechSynthesisUtterance("");
          u.volume = 0;
          window.speechSynthesis.speak(u);
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch (err) {
          console.warn("Speech priming warning:", err);
        }
      }
      try {
        const dummyAudio = new Audio();
        dummyAudio.play().catch(() => {});
      } catch (err) {
        console.warn("Audio Context priming warning:", err);
      }
    }
  };

  const stopAudio = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
  };

  const stop = () => {
    if (typeof window !== "undefined") {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopAudio();
      sentenceChunksRef.current = [];
      currentSentenceIndexRef.current = 0;
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
      setSpokenSentence("");
    }
  };

  const pause = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      setIsPaused(true);
    } else if (typeof window !== "undefined" && window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (activeAudioRef.current && isPaused) {
      activeAudioRef.current.play().catch(err => console.error("Audio resume error:", err));
      setIsPaused(false);
    } else if (typeof window !== "undefined" && window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Split text into natural sentence or phrase chunks (each under max characters)
  const splitTextIntoChunks = (text: string, maxLen = 220): string[] => {
    // Strip markdown formatting symbols but preserve standard language scripts
    const clean = text
      .replace(/[*#_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    
    if (!clean) return [];

    // Split by primary sentence boundaries (periods, exclamation, question, Indian full stop ।)
    const sentences = clean.match(/[^.!?।\n:]+[.!?।\n:]*/g) || [clean];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;
      
      if ((currentChunk + " " + trimmed).trim().length <= maxLen) {
        currentChunk = (currentChunk + " " + trimmed).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        
        if (trimmed.length > maxLen) {
          // If a single sentence is extremely long, split by commas or words
          const parts = trimmed.split(/[,，;；]/);
          let subChunk = "";
          for (const part of parts) {
            const trimmedPart = part.trim();
            if (!trimmedPart) continue;

            if ((subChunk + ", " + trimmedPart).trim().length <= maxLen) {
              subChunk = subChunk ? (subChunk + ", " + trimmedPart) : trimmedPart;
            } else {
              if (subChunk) chunks.push(subChunk);
              subChunk = trimmedPart;
            }
          }
          if (subChunk) {
            currentChunk = subChunk;
          } else {
            currentChunk = "";
          }
        } else {
          currentChunk = trimmed;
        }
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  };

  // Google TTS streaming backup for a single sentence
  const playNextGoogleTTSChunk = (sentence: string) => {
    stopAudio();
    
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${activeLangCodeRef.current}&client=tw-ob&q=${encodeURIComponent(sentence)}`;
    const audio = new Audio(url);
    activeAudioRef.current = audio;
    
    audio.onended = () => {
      currentSentenceIndexRef.current += 1;
      playNextNativeSentence();
    };
    
    audio.onerror = (err) => {
      console.warn("Google TTS backup chunk failed, skipping sentence:", err);
      currentSentenceIndexRef.current += 1;
      playNextNativeSentence();
    };
    
    audio.play().catch(err => {
      console.warn("Google TTS play blocked, skipping sentence:", err);
      currentSentenceIndexRef.current += 1;
      playNextNativeSentence();
    });
  };

  // Queue runner: plays sentence chunks sequentially
  const playNextNativeSentence = () => {
    const chunks = sentenceChunksRef.current;
    const index = currentSentenceIndexRef.current;

    if (index >= chunks.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpokenSentence("");
      return;
    }

    const sentence = chunks[index];
    setSpokenSentence(sentence);
    setIsSpeaking(true);
    setIsPaused(false);

    if (typeof window === "undefined" || !window.speechSynthesis) {
      playNextGoogleTTSChunk(sentence);
      return;
    }

    // Prepare SpeechSynthesisUtterance for the chunk
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utteranceRef.current = utterance;

    const langMap = { en: "en-US", hi: "hi-IN", te: "te-IN" };
    utterance.lang = langMap[activeLangCodeRef.current] || "en-US";

    // Match language voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    const langCode = activeLangCodeRef.current;

    if (langCode === "hi") {
      selectedVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase();
        const vName = v.name.toLowerCase();
        return (
          vLang.startsWith("hi") ||
          vLang.replace("_", "-").startsWith("hi") ||
          vName.includes("hindi") ||
          vName.includes("हिन्दी") ||
          vName.includes("kalpana") ||
          vName.includes("heera")
        );
      });
    } else if (langCode === "te") {
      selectedVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase();
        const vName = v.name.toLowerCase();
        return (
          vLang.startsWith("te") ||
          vLang.replace("_", "-").startsWith("te") ||
          vName.includes("telugu") ||
          vName.includes("తెలుగు") ||
          vName.includes("shruthi") ||
          vName.includes("shruti")
        );
      });
    } else {
      selectedVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase();
        const vName = v.name.toLowerCase();
        return (
          vLang.startsWith("en") ||
          vLang.replace("_", "-").startsWith("en") ||
          vName.includes("google") ||
          vName.includes("female") ||
          vName.includes("zira") ||
          vName.includes("samantha")
        );
      });
    }

    // General fallback for Indian accents if specific regional voice not loaded
    if (!selectedVoice && (langCode === "hi" || langCode === "te")) {
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes("in"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.94;
    utterance.pitch = 1.02;

    utterance.onend = () => {
      // Safe tiny timeout to yield threads before reading next sentence
      setTimeout(() => {
        currentSentenceIndexRef.current += 1;
        playNextNativeSentence();
      }, 80);
    };

    utterance.onerror = (e) => {
      console.warn("Native Synthesis error on sentence chunk, playing via Google TTS:", e);
      playNextGoogleTTSChunk(sentence);
    };

    window.speechSynthesis.speak(utterance);
  };

  const speak = (text: string, langCode: "en" | "hi" | "te") => {
    if (typeof window === "undefined") return;

    // Reset current active states first
    stop();

    const chunks = splitTextIntoChunks(text);
    if (chunks.length === 0) return;

    sentenceChunksRef.current = chunks;
    currentSentenceIndexRef.current = 0;
    activeLangCodeRef.current = langCode;

    playNextNativeSentence();
  };

  return {
    speak,
    stop,
    pause,
    resume,
    prime,
    isSpeaking,
    isPaused,
    currentWordIndex,
    spokenSentence,
    availableVoices,
  };
}

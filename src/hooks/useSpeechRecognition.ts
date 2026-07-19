import { useState, useEffect, useRef } from "react";

export interface UseSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: (langCode: "en" | "hi" | "te") => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(onFinalResult?: (result: string) => void): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false; // We want one statement at a time, or click to talk
      rec.interimResults = true; // Show text as they speak
      recognitionRef.current = rec;
    }
  }, []);

  const startListening = (langCode: "en" | "hi" | "te") => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      // Force stop any existing instances
      recognitionRef.current.abort();
    } catch (e) {}

    const rec = recognitionRef.current;
    
    // Map language code to Speech Recognition locale strings
    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      te: "te-IN"
    };
    rec.lang = langMap[langCode] || "en-US";

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    rec.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      setTranscript(activeText);

      if (finalTranscript && onFinalResult) {
        onFinalResult(finalTranscript);
      }
    };

    rec.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setIsListening(false);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    try {
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
}

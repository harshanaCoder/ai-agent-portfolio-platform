"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useMemo } from "react";

export type VoiceInputStatus = "idle" | "listening" | "unsupported" | "blocked" | "insecure";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
  }
}

import { twMerge } from "tailwind-merge";

type VoiceInputProps = {
  disabled?: boolean;
  status: VoiceInputStatus;
  onStatusChange: (status: VoiceInputStatus) => void;
  onTranscript: (transcript: string) => void;
  onError: (message: string) => void;
  className?: string;
};

function isSecureSpeechContext() {
  if (typeof window === "undefined") {
    return true;
  }

  const localHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  return window.isSecureContext || localHost;
}

export function VoiceInput({ disabled = false, status, onStatusChange, onTranscript, onError, className }: VoiceInputProps) {
  const recognition = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      return null;
    }

    const instance = new SpeechRecognitionApi();
    instance.continuous = false;
    instance.lang = "en-US";
    instance.interimResults = false;
    instance.maxAlternatives = 1;
    return instance;
  }, []);

  useEffect(() => {
    if (!recognition) {
      onStatusChange("unsupported");
      return;
    }

    if (!isSecureSpeechContext()) {
      onStatusChange("insecure");
      return;
    }

    onStatusChange("idle");

    return () => {
      recognition.stop();
    };
  }, [recognition, onStatusChange]);

  const startListening = () => {
    if (!recognition) {
      onStatusChange("unsupported");
      return;
    }

    if (!isSecureSpeechContext()) {
      onStatusChange("insecure");
      onError("Microphone requires HTTPS or localhost.");
      return;
    }

    if (status === "listening") {
      recognition.stop();
      onStatusChange("idle");
      return;
    }

    recognition.onresult = (event) => {
      const latestResult = event.results[event.results.length - 1];
      const transcript = latestResult?.[0]?.transcript?.trim() ?? "";

      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        onStatusChange("blocked");
        onError("Microphone permission is blocked. Please allow access and try again.");
        return;
      }

      onStatusChange("idle");
      onError("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      onStatusChange("idle");
    };

    try {
      onStatusChange("listening");
      recognition.start();
    } catch {
      onStatusChange("idle");
      onError("Unable to start voice capture. Try again in a moment.");
    }
  };

  const baseClassName = `inline-flex items-center justify-center rounded-full transition-all duration-300 ${
    status === "listening"
      ? "scale-105 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50"
      : "bg-slate-800/80 text-slate-300 ring-1 ring-white/10 hover:bg-slate-700 hover:text-white"
  } disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100`;

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={disabled || status === "unsupported" || status === "insecure"}
      aria-label={status === "listening" ? "Stop microphone" : "Start microphone"}
      className={className ? twMerge(baseClassName, className) : twMerge(baseClassName, "h-12 w-12")}
    >
      {status === "listening" ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </button>
  );
}
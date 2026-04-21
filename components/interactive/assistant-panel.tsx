"use client";

import { Mic, MicOff, Send, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { speakText as speakWithTts, stopSpeaking } from "@/components/voice/VoiceOutput";
import { assistantProfile, type ProjectData } from "@/lib/mainData";

type Message = {
  role: "assistant" | "user";
  text: string;
};

type AssistantPanelProps = {
  project: ProjectData;
  projects: ProjectData[];
  onSelectProject: (slug: string) => void;
};

type VoiceStatus = "idle" | "listening" | "unsupported" | "blocked" | "insecure";

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

function normalizeCommand(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function AssistantPanel({ project, projects, onSelectProject }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `I am ${assistantProfile.name}. Ask who I am, what I am building, what my current projects are, or tell me to explain ${project.title}.`
    }
  ]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [handsFreeVoice, setHandsFreeVoice] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [continuousVoice, setContinuousVoice] = useState(false);
  const restartTimeoutRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const speakingRef = useRef(false);
  const handsFreeVoiceRef = useRef(handsFreeVoice);
  const continuousVoiceRef = useRef(continuousVoice);
  const shouldContinueConversationRef = useRef(false);

  const recognition = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      return null;
    }

    const instance = new SpeechRecognitionApi();
    instance.lang = "en-US";
    instance.interimResults = false;
    instance.maxAlternatives = 1;
    return instance;
  }, []);

  useEffect(() => {
    if (!recognition) {
      setVoiceStatus("unsupported");
      return;
    }

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    // Microphone access requires a secure context on non-localhost origins.
    if (typeof window !== "undefined" && !window.isSecureContext && !isLocalhost) {
      setVoiceStatus("insecure");
      return;
    }

    setVoiceStatus("idle");

    return () => {
      shouldContinueConversationRef.current = false;
      recognition?.stop();

      if (typeof window !== "undefined" && restartTimeoutRef.current !== null) {
        window.clearTimeout(restartTimeoutRef.current);
      }

      stopSpeaking();
    };
  }, [recognition]);

  useEffect(() => {
    handsFreeVoiceRef.current = handsFreeVoice;

    if (!handsFreeVoice) {
      shouldContinueConversationRef.current = false;
    }
  }, [handsFreeVoice]);

  useEffect(() => {
    continuousVoiceRef.current = continuousVoice;

    if (!continuousVoice) {
      shouldContinueConversationRef.current = false;
    }
  }, [continuousVoice]);

  const startListeningTurn = () => {
    if (!recognition || loadingRef.current || speakingRef.current) {
      return;
    }

    try {
      setVoiceStatus("listening");
      recognition.start();
    } catch {
      setVoiceStatus("idle");
    }
  };

  const queueNextListeningTurn = () => {
    if (!shouldContinueConversationRef.current || !handsFreeVoiceRef.current || !continuousVoiceRef.current) {
      shouldContinueConversationRef.current = false;
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (restartTimeoutRef.current !== null) {
      window.clearTimeout(restartTimeoutRef.current);
    }

    restartTimeoutRef.current = window.setTimeout(() => {
      startListeningTurn();
    }, 420);
  };

  const speakText = (text: string, onFinished?: () => void) => {
    let didFinish = false;

    void speakWithTts(text, {
      onSpeakingChange: (speaking) => {
        speakingRef.current = speaking;

        if (!speaking && !didFinish) {
          didFinish = true;
          onFinished?.();
        }
      }
    });
  };

  const pushAssistantMessage = (text: string, continueConversation: boolean) => {
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        text
      }
    ]);

    if (autoSpeak) {
      speakText(text, queueNextListeningTurn);
      return;
    }

    if (continueConversation) {
      queueNextListeningTurn();
    }
  };

  const resolveProjectFromPrompt = (normalizedPrompt: string) => {
    return projects.find((candidate) => {
      const title = normalizeCommand(candidate.title);
      const slug = normalizeCommand(candidate.slug.replace(/-/g, " "));
      return normalizedPrompt.includes(title) || normalizedPrompt.includes(slug);
    });
  };

  const getProjectCatalogReply = () => {
    return projects
      .map((item) => `${item.title} - ${item.summary}`)
      .join("; ");
  };

  const getPerspectiveReply = (normalizedPrompt: string) => {
    if (normalizedPrompt.includes("student")) {
      return assistantProfile.perspectives.student;
    }

    if (normalizedPrompt.includes("client")) {
      return assistantProfile.perspectives.client;
    }

    if (normalizedPrompt.includes("developer")) {
      return assistantProfile.perspectives.developer;
    }

    return null;
  };

  const tryLocalCommand = (prompt: string, continueConversation: boolean) => {
    const normalizedPrompt = normalizeCommand(prompt);
    const asksForIntroduction =
      normalizedPrompt.includes("who are you") ||
      normalizedPrompt.includes("tell me about yourself") ||
      normalizedPrompt.includes("introduce yourself") ||
      normalizedPrompt.includes("about you");

    if (asksForIntroduction) {
      const reply = `${assistantProfile.intro} My interests are ${assistantProfile.interests.join(", ")}, and my strengths include ${assistantProfile.strengths.join(", ")}.`;
      pushAssistantMessage(reply, continueConversation);
      return true;
    }

    const asksForProjectList =
      normalizedPrompt.includes("list projects") ||
      normalizedPrompt.includes("show projects") ||
      normalizedPrompt.includes("what projects") ||
      normalizedPrompt.includes("available projects") ||
      normalizedPrompt.includes("current projects") ||
      normalizedPrompt.includes("your projects") ||
      normalizedPrompt.includes("projects are you working on");

    if (asksForProjectList) {
      const reply = `Current projects: ${getProjectCatalogReply()}. You can say switch to and then any project name.`;
      pushAssistantMessage(reply, continueConversation);
      return true;
    }

    const perspectiveReply = getPerspectiveReply(normalizedPrompt);

    if (perspectiveReply) {
      pushAssistantMessage(perspectiveReply, continueConversation);
      return true;
    }

    const asksToSwitch =
      normalizedPrompt.includes("switch to") ||
      normalizedPrompt.includes("change to") ||
      normalizedPrompt.includes("open project") ||
      normalizedPrompt.includes("select project");

    if (!asksToSwitch) {
      return false;
    }

    const matchedProject = resolveProjectFromPrompt(normalizedPrompt);

    if (!matchedProject) {
      pushAssistantMessage(
        "I heard a project switch command, but I could not match a project name. Say list projects to hear valid names.",
        continueConversation
      );
      return true;
    }

    if (matchedProject.slug !== project.slug) {
      onSelectProject(matchedProject.slug);
    }

    pushAssistantMessage(
      `Switched to ${matchedProject.title}. Ask for the summary, explain the build, or ask for a student, client, or developer perspective.`,
      continueConversation
    );
    return true;
  };

  const sendPrompt = async (prompt: string, options?: { continueConversation?: boolean }) => {
    const continueConversation = options?.continueConversation ?? false;
    const trimmed = prompt.trim();

    if (!trimmed) {
      return;
    }

    shouldContinueConversationRef.current = continueConversation;

    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setValue("");

    if (tryLocalCommand(trimmed, continueConversation)) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, projectSlug: project.slug })
      });

      const data = (await response.json()) as { reply?: string; error?: string };
      const assistantText = data.reply ?? data.error ?? "The assistant could not generate a response.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: assistantText
        }
      ]);

      if (autoSpeak) {
        speakText(assistantText, queueNextListeningTurn);
      } else {
        queueNextListeningTurn();
      }
    } catch {
      const fallback =
        "The assistant endpoint is reachable but the response failed. You can wire this route to OpenAI or another model provider.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: fallback
        }
      ]);

      if (autoSpeak) {
        speakText(fallback, queueNextListeningTurn);
      } else {
        queueNextListeningTurn();
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const startVoiceCapture = () => {
    if (!recognition) {
      setVoiceStatus("unsupported");
      return;
    }

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (typeof window !== "undefined" && !window.isSecureContext && !isLocalhost) {
      setVoiceStatus("insecure");
      return;
    }

    if (voiceStatus === "listening") {
      shouldContinueConversationRef.current = false;
      recognition.stop();
      setVoiceStatus("idle");
      return;
    }

    if (loadingRef.current || speakingRef.current) {
      return;
    }

    shouldContinueConversationRef.current = handsFreeVoice && continuousVoice;

    recognition.onresult = (event) => {
      const latestResult = event.results[event.results.length - 1];
      const transcript = latestResult?.[0]?.transcript ?? "";

      if (!transcript.trim()) {
        return;
      }

      if (handsFreeVoiceRef.current) {
        void sendPrompt(transcript, {
          continueConversation: continuousVoiceRef.current
        });
        return;
      }

      shouldContinueConversationRef.current = false;

      setValue(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        shouldContinueConversationRef.current = false;
        setVoiceStatus("blocked");
        return;
      }

      setVoiceStatus("idle");
    };

    recognition.onend = () => {
      setVoiceStatus("idle");

      if (shouldContinueConversationRef.current && !loadingRef.current && !speakingRef.current) {
        queueNextListeningTurn();
      }
    };

    startListeningTurn();
  };

  const speakLatest = () => {
    const latestMessage = [...messages].reverse().find((message) => message.role === "assistant");

    if (!latestMessage) {
      return;
    }

    speakText(latestMessage.text);
  };

  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/80">Project AI Assistant</p>
          <h3 className="mt-3 font-display text-2xl text-white">Ask the system</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">
            Voice-ready interface for architecture walkthroughs, debugging context, and engineering tradeoff explanations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHandsFreeVoice((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${handsFreeVoice ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/20 hover:bg-cyan-400/10"}`}
            aria-pressed={handsFreeVoice}
          >
            {handsFreeVoice ? "Hands-free on" : "Hands-free off"}
          </button>
          <button
            type="button"
            onClick={() => setContinuousVoice((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${continuousVoice ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/20 hover:bg-cyan-400/10"}`}
            aria-pressed={continuousVoice}
          >
            {continuousVoice ? "Continuous on" : "Continuous off"}
          </button>
          <button
            type="button"
            onClick={() => setAutoSpeak((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${autoSpeak ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/20 hover:bg-cyan-400/10"}`}
            aria-pressed={autoSpeak}
          >
            {autoSpeak ? "Auto speak on" : "Auto speak off"}
          </button>
          <button
            type="button"
            onClick={speakLatest}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/20 hover:bg-cyan-400/10"
          >
            <Volume2 className="h-4 w-4" />
            Speak
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === "assistant" ? "bg-white/5 text-slate-100" : "ml-auto bg-cyan-400/10 text-cyan-50"}`}
          >
            {message.text}
          </div>
        ))}
        {loading ? <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">Generating response...</div> : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="assistant-input">
          Ask about the project
        </label>
        <input
          id="assistant-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={`Ask about ${project.title}...`}
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startVoiceCapture}
            className={`inline-flex h-12 items-center justify-center rounded-2xl border px-4 text-slate-200 transition ${voiceStatus === "listening" ? "border-cyan-300/45 bg-cyan-400/20 text-cyan-100" : "border-white/10 bg-white/5 hover:border-cyan-300/20 hover:bg-cyan-400/10"}`}
            aria-label={voiceStatus === "listening" ? "Stop voice capture" : "Start voice capture"}
            disabled={loading}
          >
            {voiceStatus === "listening" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => sendPrompt(value)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || !value.trim()}
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
        <Sparkles className="h-4 w-4 text-cyan-200" />
        <span>
          {voiceStatus === "listening"
            ? "Listening... ask your question now."
            : voiceStatus === "unsupported"
              ? "Voice capture is not supported in this browser."
              : voiceStatus === "insecure"
                ? "Voice capture requires HTTPS (or localhost). Open this site in a secure context and try again."
              : voiceStatus === "blocked"
                ? "Microphone permission was blocked. Enable mic access and try again."
                : handsFreeVoice && continuousVoice
                  ? "Continuous mode is enabled. Tap mic once to start an ongoing voice conversation."
                : handsFreeVoice
                  ? "Hands-free is enabled. Tap mic to ask, and the assistant can answer by voice."
                  : "Manual voice mode: tap mic to fill the input, then press Send."}
        </span>
      </div>
    </div>
  );
}

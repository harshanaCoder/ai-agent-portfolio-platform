"use client";

import { Send, Briefcase, Trophy, Code, User, X, Keyboard, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChatUI, type ChatMessage } from "@/components/voice/ChatUI";
import { VoiceAvatar } from "@/components/voice/VoiceAvatar";
import { VoiceInput, type VoiceInputStatus } from "@/components/voice/VoiceInput";
import { speakText, stopSpeaking } from "@/components/voice/VoiceOutput";
import { voiceAssistantSuggestions } from "@/lib/assistantPrompts";
import { contactLinks, projects } from "@/lib/mainData";

type AiResponse = {
  reply?: string;
  error?: string;
};

const INITIAL_GREETING =
  "Hi, I am Janith's digital twin. Ask me about skills, project challenges, achievements, or the journey behind this portfolio.";

function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content
  };
}

function normalizeCommand(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function detectVoiceIntent(value: string) {
  const normalized = normalizeCommand(value);

  if (
    normalized.includes("who are you") ||
    normalized.includes("tell me about yourself") ||
    normalized.includes("bio") ||
    normalized.includes("background") ||
    normalized.includes("intro")
  ) {
    return "bio";
  }

  if (
    normalized.includes("education") ||
    normalized.includes("study") ||
    normalized.includes("academic") ||
    normalized.includes("learning path") ||
    normalized.includes("school") ||
    normalized.includes("college")
  ) {
    return "education";
  }

  if (normalized.includes("project") || normalized.includes("built") || normalized.includes("showcase")) {
    return "projects";
  }

  if (normalized.includes("certificate") || normalized.includes("certification")) {
    return "certificates";
  }

  if (normalized.includes("badge")) {
    return "badges";
  }

  if (normalized.includes("license")) {
    return "licenses";
  }

  if (
    normalized.includes("contact") ||
    normalized.includes("email") ||
    normalized.includes("linkedin") ||
    normalized.includes("github") ||
    normalized.includes("resume") ||
    normalized.includes("reach you")
  ) {
    return "contact";
  }

  return "";
}

function openExternalLink(url: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");
  return Boolean(openedWindow);
}

function getSuggestionIcon(label: string) {
  const normalized = normalizeCommand(label);

  if (normalized.includes("skill")) {
    return <Briefcase className="h-3.5 w-3.5" />;
  }

  if (normalized.includes("achievement")) {
    return <Trophy className="h-3.5 w-3.5" />;
  }

  if (normalized.includes("project") || normalized.includes("challenge")) {
    return <Code className="h-3.5 w-3.5" />;
  }

  if (normalized.includes("journey") || normalized.includes("background")) {
    return <User className="h-3.5 w-3.5" />;
  }

  return <Send className="h-3.5 w-3.5" />;
}

const QUICK_ACTIONS = voiceAssistantSuggestions.map((label) => ({
  label,
  icon: getSuggestionIcon(label)
}));

export function VoiceAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", INITIAL_GREETING)
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceInputStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTypewriterMessageId, setActiveTypewriterMessageId] = useState<string | null>(messages[0]?.id ?? null);
  const [canStartTypewriter, setCanStartTypewriter] = useState(true);
  const hasSpokenInitialGreeting = useRef(false);

  const isListening = voiceStatus === "listening";
  const canRecord = !isLoading && !isSpeaking;
  const githubProfileLink = contactLinks.find((link) => link.label.toLowerCase() === "github")?.href;
  const linkedinProfileLink = contactLinks.find((link) => link.label.toLowerCase() === "linkedin")?.href;

  const historyForApi = useMemo(() => {
    return messages.slice(-10).map((message) => ({
      role: message.role,
      content: message.content
    }));
  }, [messages]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    const firstMessage = messages[0];
    if (!firstMessage || firstMessage.role !== "assistant" || isMuted || hasSpokenInitialGreeting.current) {
      return;
    }

    let didStartPlayback = false;
    hasSpokenInitialGreeting.current = true;
    void speakText(firstMessage.content || INITIAL_GREETING, {
      onSpeakingChange: setIsSpeaking,
      onPlaybackStart: () => {
        didStartPlayback = true;
        setCanStartTypewriter(true);
      }
    }).then(() => {
      if (!didStartPlayback) {
        setCanStartTypewriter(true);
      }
    });
  }, [isMuted, messages]);

  const handleLinkCommand = useCallback(async (rawMessage: string) => {
    const normalized = normalizeCommand(rawMessage);

    const hasOpenIntent =
      normalized.includes("open") ||
      normalized.includes("visit") ||
      normalized.includes("go to") ||
      normalized.includes("show") ||
      normalized.includes("navigate");

    const asksForLinkedin = normalized.includes("linkedin") || normalized.includes("linked in");
    const asksForGithub = normalized.includes("github") || normalized.includes("git hub");
    const asksForProjectRepo =
      normalized.includes("project") || normalized.includes("repo") || normalized.includes("repository");

    if (!hasOpenIntent && !asksForLinkedin && !asksForGithub) {
      return false;
    }

    const matchedProject = projects.find((project) => {
      const projectTitle = normalizeCommand(project.title);
      const projectSlug = normalizeCommand(project.slug.replace(/-/g, " "));
      return normalized.includes(projectTitle) || normalized.includes(projectSlug);
    });

    let targetUrl: string | null = null;
    let reply = "";

    if (asksForLinkedin) {
      targetUrl = linkedinProfileLink ?? null;
      reply = targetUrl
        ? "Opening LinkedIn profile now."
        : "I could not find a LinkedIn link in the portfolio data.";
    } else if (asksForGithub && matchedProject) {
      targetUrl = matchedProject.github;
      reply = `Opening GitHub repository for ${matchedProject.title}.`;
    } else if (asksForGithub && (asksForProjectRepo || normalized.includes("project github"))) {
      reply = "Please mention the project name, for example: open Drone Autonomy Stack GitHub.";
    } else if (asksForGithub) {
      targetUrl = githubProfileLink ?? null;
      reply = targetUrl
        ? "Opening GitHub profile now."
        : "I could not find a GitHub profile link in the portfolio data.";
    }

    if (!reply) {
      return false;
    }

    if (targetUrl) {
      const wasOpened = openExternalLink(targetUrl);
      if (!wasOpened) {
        reply = "Your browser blocked the popup. Please allow popups and try again.";
      }
    }

    const assistantMessage = createMessage("assistant", reply);
    setMessages((current) => [...current, assistantMessage]);
    setActiveTypewriterMessageId(assistantMessage.id);
    setCanStartTypewriter(isMuted);

    if (!isMuted) {
      let didStartPlayback = false;
      await speakText(reply, {
        onSpeakingChange: setIsSpeaking,
        onPlaybackStart: () => {
          didStartPlayback = true;
          setCanStartTypewriter(true);
        }
      });

      if (!didStartPlayback) {
        setCanStartTypewriter(true);
      }
    }

    return true;
  }, [githubProfileLink, isMuted, linkedinProfileLink]);

  const sendMessage = useCallback(async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;
    if (isListening) setVoiceStatus("idle");

    setError(null);

    const userMessage = createMessage("user", message);
    setMessages((current) => [...current, userMessage]);
    setInput("");

    const intent = detectVoiceIntent(message);

    const handledByLinkCommand = await handleLinkCommand(message);
    if (handledByLinkCommand) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          intent,
          history: historyForApi
        })
      });

      const data = (await response.json()) as AiResponse;
      const assistantReply = data.reply?.trim() || data.error?.trim() || "I could not respond right now. Please try again.";
      const assistantMessage = createMessage("assistant", assistantReply);
      setMessages((current) => [...current, assistantMessage]);
      setActiveTypewriterMessageId(assistantMessage.id);
      setCanStartTypewriter(isMuted);

      if (!isMuted) {
        let didStartPlayback = false;
        await speakText(assistantReply, {
          onSpeakingChange: setIsSpeaking,
          onPlaybackStart: () => {
            didStartPlayback = true;
            setCanStartTypewriter(true);
          }
        });

        if (!didStartPlayback) {
          setCanStartTypewriter(true);
        }
      }
    } catch {
      const fallback = "The AI service is unavailable right now. Please try again in a moment.";
      const fallbackMessage = createMessage("assistant", fallback);
      setMessages((current) => [...current, fallbackMessage]);
      setActiveTypewriterMessageId(fallbackMessage.id);
      setCanStartTypewriter(true);
      setError("API request failed.");
    } finally {
      setIsLoading(false);
    }
  }, [handleLinkCommand, historyForApi, isListening, isLoading, isMuted]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  }, [input, sendMessage]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Mute toggle — top right, independent of avatar scaling */}
      <button
        type="button"
        onClick={() => {
          setIsMuted(!isMuted);
          if (!isMuted) stopSpeaking();
        }}
        className={`absolute right-4 top-2 z-50 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${
          isMuted
            ? "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            : "border-cyan-500/30 bg-black/50 text-cyan-400 hover:bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        }`}
        aria-label={isMuted ? "Unmute agent voice" : "Mute agent voice"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Avatar Container — scales down and reduces height instead of absolute positioning */}
      <div 
        className={`relative flex justify-center shrink-0 transition-all duration-1000 ease-in-out origin-top ${
          messages.length > 2 ? 'h-[80px] scale-[0.35]' : 'h-[220px] sm:h-[280px] lg:h-[320px] scale-100'
        }`}
      >
        <div className="pointer-events-none">
          <VoiceAvatar isListening={isListening} isSpeaking={isSpeaking} />
        </div>
      </div>

      {/* Chat messages area — scrollable, takes remaining space */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden w-full">
        <ChatUI
          messages={messages}
          isLoading={isLoading}
          isListening={isListening}
          isSpeaking={isSpeaking}
          activeTypewriterMessageId={activeTypewriterMessageId}
          canStartTypewriter={canStartTypewriter}
        />
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 border-t border-white/5 bg-black/20 px-4 pb-4 pt-3 backdrop-blur-sm">
        {/* Quick Actions */}
        {!isListening && messages.length <= 3 && (
          <div className="mb-4 flex flex-wrap justify-center gap-2 px-1 sm:mb-6 sm:gap-3 sm:px-2">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => void sendMessage(action.label)}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-black/40 px-3 py-2 text-xs font-medium tracking-wide text-cyan-50 backdrop-blur-md transition-all hover:scale-105 hover:bg-cyan-950/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] shadow-[0_0_15px_rgba(6,182,212,0.2)] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <span className="text-cyan-400">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex w-full items-center justify-center">
          {isListening ? (
            /* LISTENING mode — centered mic controls */
            <div className="flex w-full items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setVoiceStatus("idle")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <Keyboard className="h-4 w-4" />
              </button>

              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                <VoiceInput
                  disabled={!canRecord}
                  status={voiceStatus}
                  onStatusChange={setVoiceStatus}
                  onTranscript={(transcript) => {
                    void sendMessage(transcript);
                  }}
                  onError={(message) => setError(message)}
                  className="relative z-10 h-14 w-14 !rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-4 ring-emerald-500/20"
                />
              </div>

              <button
                type="button"
                onClick={() => setVoiceStatus("idle")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* IDLE mode — text input with mic/send */
            <div className="flex w-full items-center gap-3 rounded-full border border-cyan-500/50 bg-black/50 p-2 pl-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl transition-all hover:bg-black/60 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.6)] focus-within:bg-black/70">
              
              {/* Reference interface specific purely aesthetic N avatar inside input */}
              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-950/40 text-base font-bold text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.5)] xs:flex sm:flex sm:h-11 sm:w-11 sm:text-lg">
                N
              </div>

              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type a message..."
                className="min-w-0 flex-1 bg-transparent py-2 text-base tracking-wide text-cyan-50 placeholder-cyan-500/60 outline-none"
                disabled={isLoading}
              />

              <div className="flex shrink-0 items-center gap-1.5 pr-2">
                {!input.trim() ? (
                  <VoiceInput
                    disabled={!canRecord}
                    status={voiceStatus}
                    onStatusChange={setVoiceStatus}
                    onTranscript={(transcript) => {
                      void sendMessage(transcript);
                    }}
                    onError={(message) => setError(message)}
                    className="h-10 w-10 !rounded-full bg-transparent text-cyan-500/70 shadow-none ring-0 hover:bg-cyan-500/10 hover:text-cyan-400 focus:text-cyan-400 transition-colors"
                  />
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-black transition-all hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] disabled:scale-100 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Error feedback */}
        {error && (
          <p className="mt-2 text-center text-xs text-red-400/80">{error}</p>
        )}
      </div>
    </div>
  );
}

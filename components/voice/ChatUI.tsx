"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatUIProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  activeTypewriterMessageId: string | null;
  canStartTypewriter: boolean;
};

function TypewriterText({ text, canStart }: { text: string; canStart: boolean }) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    setDisplayedLength(0);
  }, [text]);

  useEffect(() => {
    if (!canStart || displayedLength >= text.length) {
      return;
    }

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev < text.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [canStart, displayedLength, text.length]);

  return (
    <>
      {text.slice(0, displayedLength)}
      {displayedLength < text.length && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
      )}
    </>
  );
}

export function ChatUI({ messages, isLoading, activeTypewriterMessageId, canStartTypewriter }: ChatUIProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lastMessageId, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col gap-6 overflow-y-auto scroll-smooth px-4 py-6"
      style={{ scrollbarWidth: "none" }}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const isTypingMessage = msg.role === "assistant" && msg.id === activeTypewriterMessageId;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex w-full justify-center px-2 md:px-10"
            >
              <div
                className={`relative w-full text-center px-6 py-5 text-sm md:text-[15px] tracking-wide leading-relaxed backdrop-blur-md rounded-[2rem] md:rounded-full border ${
                  isUser
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "border-cyan-400/50 bg-black/40 text-cyan-50 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                }`}
              >
                {/* HUD accent lines for assistant */}
                {!isUser && (
                  <>
                    <div className="absolute -top-[1px] left-1/2 w-32 -translate-x-1/2 h-[2px] bg-cyan-400 blur-[1px] shadow-[0_0_15px_rgba(6,182,212,1)]" />
                    <div className="absolute -bottom-[1px] left-1/2 w-48 -translate-x-1/2 h-[2px] bg-cyan-400 blur-[1px] shadow-[0_0_15px_rgba(6,182,212,1)]" />
                  </>
                )}
                {/* HUD accent lines for user */}
                {isUser && (
                  <>
                    <div className="absolute -top-[1px] right-16 w-16 h-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </>
                )}

                {isTypingMessage ? (
                  <TypewriterText text={msg.content} canStart={canStartTypewriter} />
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading indicator as a HUD bubble */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex w-full justify-center px-2 md:px-10"
          >
            <div className="relative flex items-center justify-center px-10 py-5 rounded-full border border-cyan-400/50 bg-black/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-md">
              <div className="absolute -bottom-[1px] left-1/2 w-24 -translate-x-1/2 h-[2px] bg-cyan-400 blur-[1px] shadow-[0_0_15px_rgba(6,182,212,1)]" />
              <div className="flex items-center gap-2">
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

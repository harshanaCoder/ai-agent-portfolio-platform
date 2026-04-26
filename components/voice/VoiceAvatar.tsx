"use client";

import { useEffect, useRef, useState } from "react";

type VoiceAvatarProps = {
  isListening: boolean;
  isSpeaking: boolean;
};

export function VoiceAvatar({ isListening, isSpeaking }: VoiceAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mouthTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Blink logic
  useEffect(() => {
    function scheduleBlink() {
      const delay = 2000 + Math.random() * 3500;
      blinkTimer.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 120);
      }, delay);
    }

    scheduleBlink();
    return () => clearTimeout(blinkTimer.current);
  }, []);

  // Mouth animation when speaking
  useEffect(() => {
    if (isSpeaking) {
      mouthTimer.current = setInterval(() => {
        setMouthOpen(Math.random());
      }, 110);
    } else {
      clearInterval(mouthTimer.current);
      setMouthOpen(0);
    }

    return () => clearInterval(mouthTimer.current);
  }, [isSpeaking]);

  const accentGlow = isSpeaking
    ? "rgba(20,184,166,0.4)" // bright teal
    : isListening
      ? "rgba(6,182,212,0.4)" // bright cyan
      : "rgba(16,185,129,0.15)"; // emerald base

  const ringColor = isSpeaking
    ? "border-teal-400/50 shadow-[0_0_30px_rgba(20,184,166,0.6)]"
    : isListening
      ? "border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.6)]"
      : "border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]";

  return (
    <div className="relative flex w-full items-center justify-center py-4 sm:py-6">
      {/* Deep HUD Ambient background blur */}
      <div
        className="absolute rounded-full blur-[100px] transition-all duration-1000"
        style={{
          width: 300,
          height: 300,
          background: accentGlow,
          transform: isSpeaking ? "scale(1.1)" : isListening ? "scale(0.95)" : "scale(0.8)"
        }}
      />

      {/* --- Sci-Fi HUD Rings --- */}
      <div className="absolute flex items-center justify-center pointer-events-none opacity-80">
        {/* Outer dashed targeting ring */}
        <div className="absolute h-[320px] w-[320px] animate-[spin_30s_linear_infinite] rounded-full border-[1.5px] border-dashed border-teal-500/40" />
        
        {/* Reverse spinning segmented ring */}
        <div className="absolute h-[290px] w-[290px] animate-[spin_20s_linear_infinite_reverse] rounded-full border-x-2 border-y-[0.5px] border-cyan-400/30" />
        
        {/* Precision dots track */}
        <svg className="absolute h-[260px] w-[260px] text-emerald-400/50 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
        </svg>

        {/* Inner solid containment ring */}
        <div className="absolute h-[230px] w-[230px] rounded-full border border-teal-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.1)]" />
      </div>

      {/* Listening active scanner */}
      {isListening && (
        <div
          className="absolute h-[250px] w-[250px] animate-[spin_3s_linear_infinite] rounded-full border-r-2 border-t-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
        />
      )}

      {/* Speaking active equalizer rings */}
      {isSpeaking && (
        <>
          <div
            className="absolute h-[240px] w-[240px] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-[2px] border-teal-400/50 shadow-[0_0_20px_rgba(20,184,166,0.6)]"
          />
          <div
            className="absolute h-[270px] w-[270px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            style={{ animationDelay: "0.4s" }}
          />
        </>
      )}

      {/* FACE */}
      <div
        className={`relative z-10 flex flex-col items-center overflow-hidden rounded-full border transition-all duration-700 ${ringColor}`}
        style={{
          width: 168,
          height: 200,
          background: "linear-gradient(170deg, #f5c5a3 0%, #e8a882 40%, #d4896a 80%, #c07a5e 100%)",
          boxShadow:
            `0 8px 40px ${accentGlow}, 0 2px 12px rgba(0,0,0,0.4), inset 0 -20px 40px rgba(120,60,20,0.3), inset 0 10px 20px rgba(255,220,190,0.4)`,
          animation: !isSpeaking && !isListening ? "breathing 4s ease-in-out infinite" : undefined
        }}
      >
        {/* Forehead highlight */}
        <div
          className="absolute inset-x-4 top-2 h-16 rounded-full opacity-50"
          style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,240,220,0.7), transparent 70%)" }}
        />

        {/* Cheek blush */}
        <div
          className="absolute rounded-full opacity-30"
          style={{ width: 38, height: 22, background: "radial-gradient(ellipse, #e07060, transparent 70%)", left: 8, top: 98 }}
        />
        <div
          className="absolute rounded-full opacity-30"
          style={{ width: 38, height: 22, background: "radial-gradient(ellipse, #e07060, transparent 70%)", right: 8, top: 98 }}
        />

        {/* Eyes */}
        <div className="relative mb-3 mt-10 flex items-center gap-9">
          {[0, 1].map((side) => (
            <div key={side} className="relative flex items-center justify-center">
              <div
                className="absolute -top-5 rounded-full bg-[#5a3018] opacity-80"
                style={{ width: 30, height: 5, transform: side === 0 ? "rotate(-6deg)" : "rotate(6deg)" }}
              />
              <div
                className="relative flex items-center justify-center rounded-full bg-white shadow-inner transition-all duration-150"
                style={{
                  width: 34,
                  height: isBlinking ? 3 : 28,
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)"
                }}
              >
                {!isBlinking && (
                  <>
                    <div
                      className="flex items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        width: isSpeaking ? 16 : isListening ? 18 : 14,
                        height: isSpeaking ? 16 : isListening ? 18 : 14,
                        background: isSpeaking
                          ? "radial-gradient(circle at 35% 35%, #5aeac0, #0d9f6f)"
                          : isListening
                            ? "radial-gradient(circle at 35% 35%, #60c8f5, #0a7ab5)"
                            : "radial-gradient(circle at 35% 35%, #a0724a, #5c3418)",
                        boxShadow: isSpeaking
                          ? "0 0 8px rgba(52,211,153,0.6)"
                          : isListening
                            ? "0 0 8px rgba(56,189,248,0.5)"
                            : "none"
                      }}
                    >
                      <div className="rounded-full bg-black/80" style={{ width: 6, height: 6 }} />
                    </div>
                    <div
                      className="absolute rounded-full bg-white/80"
                      style={{ width: 6, height: 6, top: 4, left: side === 0 ? 8 : 7 }}
                    />
                  </>
                )}
              </div>
              {!isBlinking && (
                <div
                  className="absolute -bottom-1.5 rounded-full bg-[#c07a5e]/40"
                  style={{ width: 32, height: 3 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Nose */}
        <div className="relative mb-3 flex flex-col items-center">
          <div className="h-5 w-0.5 rounded-full bg-[#c07a5e]/50" />
          <div className="mt-0.5 flex gap-3">
            <div className="h-2 w-3 rounded-full bg-[#a06040]/50" />
            <div className="h-2 w-3 rounded-full bg-[#a06040]/50" />
          </div>
        </div>

        {/* Mouth */}
        <div className="relative flex flex-col items-center">
          <div
            className="rounded-tl-full rounded-tr-full"
            style={{
              width: 52,
              height: 8,
              background: "linear-gradient(to bottom, #c0524a, #d96458)",
              boxShadow: isSpeaking ? "0 0 8px rgba(200,80,70,0.5)" : undefined
            }}
          />
          <div
            style={{
              width: 44,
              height: isSpeaking ? Math.max(4, Math.round(mouthOpen * 26)) : isListening ? 3 : 2,
              background: "#3a1a10",
              transition: isSpeaking ? "height 90ms ease" : "height 300ms ease"
            }}
          />
          <div
            className="rounded-bl-full rounded-br-full"
            style={{
              width: 56,
              height: 10,
              background: "linear-gradient(to bottom, #d96458, #e88070)"
            }}
          />
          <div
            className="absolute rounded-full bg-white/30"
            style={{ width: 18, height: 4, top: 10, left: "50%", transform: "translateX(-50%)" }}
          />
        </div>

        {/* Chin shadow */}
        <div
          className="absolute inset-x-0 bottom-0 h-10 rounded-b-full opacity-40"
          style={{ background: "linear-gradient(to top, #a06040, transparent)" }}
        />
      </div>

      <style>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.022); }
        }
      `}</style>

      {/* Status bar */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/60 px-4 py-1.5 backdrop-blur-md">
          {isSpeaking ? (
            <div className="flex h-3 items-end gap-0.5">
              {[0.5, 0.8, 1, 0.7, 0.9, 0.6, 0.85].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-emerald-400"
                  style={{
                    height: `${h * 100}%`,
                    animation: `pulse ${0.4 + i * 0.08}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.06}s`
                  }}
                />
              ))}
            </div>
          ) : (
            <div className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? "bg-emerald-400" : isListening ? "bg-sky-400" : "bg-slate-500"}`} />
          )}
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {isSpeaking ? "Speaking" : isListening ? "Listening" : "Ready"}
          </p>
        </div>
      </div>
    </div>
  );
}

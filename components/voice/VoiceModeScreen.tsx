"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { VoiceAgent } from "@/components/voice/VoiceAgent";

export function VoiceModeScreen() {
  const router = useRouter();

  return (
    <main 
      className="relative flex h-screen flex-col overflow-hidden bg-[#020508] text-white"
      style={{ backgroundImage: "url('/hud_space_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-black/40 backdrop-blur-[2px]">
        {/* Subtle radial mask over the bg for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Top HUD Navigation Console */}
      <div className="z-40 flex w-full shrink-0 flex-wrap items-center justify-between gap-2 px-3 pt-4 sm:px-6 sm:pt-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="relative flex items-center gap-1.5 rounded-r-3xl rounded-l-full border border-teal-500/50 bg-black/50 px-3 py-1.5 text-xs font-medium tracking-wide text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-md transition hover:border-teal-400 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] sm:gap-2 sm:px-5 sm:py-2 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-teal-400 sm:h-4 sm:w-4" />
          Back
          {/* Subtle HUD accent lines */}
          <div className="absolute -bottom-[1px] right-4 h-[2px] w-6 bg-teal-400 shadow-[0_0_10px_2px_rgba(20,184,166,0.8)]" />
        </button>

        <div className="relative flex items-center gap-1.5 rounded-l-3xl rounded-r-full border border-teal-500/50 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-50 shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-md sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.25em]">
          <Sparkles className="h-3 w-3 text-teal-400 sm:h-3.5 sm:w-3.5" />
          Voice Agent
          <div className="absolute -bottom-[1px] left-4 h-[2px] w-10 bg-teal-400 shadow-[0_0_10px_2px_rgba(20,184,166,0.8)]" />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <VoiceAgent />
        </div>
      </div>
    </main>
  );
}

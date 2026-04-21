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
      <div className="z-40 flex w-full shrink-0 items-center justify-between px-6 pt-6 sm:px-10">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="relative flex items-center gap-2 rounded-r-3xl rounded-l-full border border-teal-500/50 bg-black/50 px-5 py-2 text-sm font-medium tracking-wide text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-md transition hover:border-teal-400 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]"
        >
          <ArrowLeft className="h-4 w-4 text-teal-400" />
          Back
          {/* Subtle HUD accent lines */}
          <div className="absolute -bottom-[1px] right-4 h-[2px] w-6 bg-teal-400 shadow-[0_0_10px_2px_rgba(20,184,166,0.8)]" />
        </button>

        <div className="relative flex items-center gap-2 rounded-l-3xl rounded-r-full border border-teal-500/50 bg-black/50 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-50 shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
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

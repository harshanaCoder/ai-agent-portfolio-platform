"use client";

import { Mic, Volume2 } from "lucide-react";

import { VoiceAgent } from "@/components/voice/VoiceAgent";
import { SectionHeading } from "@/components/ui/section-heading";

type VoiceAgentSectionProps = {
  mode: "portfolio" | "voice";
};

export function VoiceAgentSection({ mode }: VoiceAgentSectionProps) {
  const isVoiceMode = mode === "voice";

  return (
    <section id="voice-agent" className={`section-bg ${isVoiceMode ? "scroll-mt-28" : ""}`}>
      <SectionHeading
        eyebrow={isVoiceMode ? "Voice Agent Mode" : "Voice Agent"}
        title="Talk directly with your portfolio assistant"
        description={
          isVoiceMode
            ? "The portfolio is now in voice agent mode. Ask about skills, projects, challenges, or the journey behind the work."
            : "Ask who Janith is, what projects are current, explain a build, or switch the answer style for a student, client, or developer perspective."
        }
        action={
          <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${isVoiceMode ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-teal-300/25 bg-teal-300/10 text-teal-100"}`}>
            <Mic className="h-4 w-4" />
            <Volume2 className="h-4 w-4" />
            {isVoiceMode ? "Voice mode active" : "Voice-ready"}
          </div>
        }
      />

      <div className="mt-8">
        <VoiceAgent />
      </div>
    </section>
  );
}

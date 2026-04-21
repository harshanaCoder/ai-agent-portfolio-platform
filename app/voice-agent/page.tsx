import type { Metadata } from "next";

import { VoiceModeScreen } from "@/components/voice/VoiceModeScreen";

export const metadata: Metadata = {
  title: "Voice Agent Mode | Janith Harshana",
  description: "A dedicated voice-only screen for Janith's portfolio digital twin."
};

export default function VoiceAgentPage() {
  return <VoiceModeScreen />;
}
import type { PortfolioProject } from "../../voiceAssistantData";

export const aiAgentPortfolioPlatformProject: PortfolioProject = {

    "name": "AI Agent Portfolio Platform",
    "summary": "An interactive portfolio that adds AI chat and voice interaction on top of structured personal/project data.\nIt provides dedicated API routes for assistant responses, voice output, and contact handling.",
    "description_long": "The system is built on Next.js App Router with a section-based portfolio UI and a separate voice-agent screen. Portfolio entities are defined in typed data modules and reused across normal mode and voice mode. On the backend, `/api/assistant` builds project-aware context and calls Gemini or OpenAI with strict input validation, size checks, and fallback behavior when providers are unavailable. `/api/ai` handles conversational voice-mode requests with intent routing and bounded chat history. `/api/tts` sends text to ElevenLabs and streams audio, while the client-side voice layer falls back to browser speech synthesis if provider TTS fails. `/api/contact` validates input, rate-limits requests, and sends email via Resend.",
    "role": "Built the Next.js frontend, typed portfolio data layer, voice agent UI flow, AI integration routes (`/api/assistant` and `/api/ai`), TTS route with fallback behavior, and contact API with validation and rate limiting.",
    "technologies": [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Three.js",
        "@react-three/fiber",
        "@react-three/drei",
        "OpenAI API",
        "Google Gemini API",
        "ElevenLabs API",
        "Resend",
        "Web Speech API"
    ],
    "challenges": [
        "Maintaining reliable responses across multiple LLM providers with different APIs and failure modes.",
        "Handling browser voice-capture constraints such as HTTPS requirements, unsupported speech APIs, and blocked microphone permissions.",
        "Keeping voice playback stable when external TTS fails or requests are interrupted.",
        "Protecting public API routes from malformed payloads, oversized requests, and high-frequency abuse."
    ],
    "optimizations": [
        "Implemented provider fallback paths and normalized request/response handling for Gemini and OpenAI routes.",
        "Limited message/history sizes and output tokens to control request scope and response consistency.",
        "Added dynamic imports for below-the-fold sections and disabled SSR for heavy 3D background rendering.",
        "Used abort controllers, object URL cleanup, and browser speech synthesis fallback to improve TTS resilience.",
        "Added input validation, content-type checks, payload limits, and in-memory rate limiting for API safety."
    ],
    "outcomes": [
        "Delivered a portfolio experience with both standard navigation and conversational voice mode.",
        "Enabled project-aware assistant responses using structured portfolio data.",
        "Shipped working text-to-speech output with fallback behavior when provider TTS is unavailable.",
        "Enabled direct contact submission through a validated email delivery pipeline."
    ],
    "demo_story": "This portfolio works like an interactive technical profile. You can browse sections normally, or switch to voice mode and ask about projects, education, certificates, and contact details. The assistant route builds answers from structured portfolio data and calls Gemini or OpenAI when configured. For spoken responses, text is sent to ElevenLabs, and if that fails, the browser speech engine takes over so the conversation can continue.",
    "keywords": [
        "nextjs",
        "typescript",
        "react",
        "tailwindcss",
        "voice-assistant",
        "llm-integration",
        "openai-api",
        "gemini-api",
        "elevenlabs-tts",
        "web-speech-api",
        "app-router",
        "api-validation",
        "rate-limiting",
        "threejs"
    ],
    "pipeline": "User input (text or voice) -> intent detection and message normalization -> `/api/ai` or `/api/assistant` validation -> context assembly from typed portfolio data -> provider call (Gemini/OpenAI) -> assistant reply rendering -> optional `/api/tts` synthesis via ElevenLabs -> audio playback with browser speech fallback if needed.",
    "faqs": [
        {
            "question": "Does this portfolio use only static content?",
            "answer": "No. It combines static structured data with dynamic API routes for AI responses, TTS, and contact submission."
        },
        {
            "question": "How does the voice interaction work?",
            "answer": "Voice input uses browser speech recognition, then text is sent to the AI route; responses are spoken using ElevenLabs with browser synthesis fallback."
        },
        {
            "question": "What happens if an AI provider is unavailable?",
            "answer": "The routes return controlled error responses and include fallback logic between configured providers."
        },
        {
            "question": "How is API safety handled?",
            "answer": "The routes enforce JSON content checks, length limits, validation rules, and rate limiting for contact requests."
        },
        {
            "question": "Can this architecture be extended for more portfolio projects?",
            "answer": "Yes. Project and credential data are typed and centralized, so new entries can be added and reused across normal and voice modes."
        }
    ]





};

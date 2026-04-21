# AI Agent Portfolio Platform

An interactive portfolio built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** that combines a modern project showcase with an AI-powered assistant and voice interaction mode.

This project supports:
- Traditional portfolio browsing
- Dedicated voice-agent screen
- AI Q&A with provider fallback (Gemini -> OpenAI)
- Text-to-speech responses (ElevenLabs with browser speech fallback)
- Contact form email delivery via Resend
- 3D visuals and animated UI experience

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [How AI and Voice Work](#how-ai-and-voice-work)
- [Customize Your Portfolio Content](#customize-your-portfolio-content)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview
The platform is designed as a full-stack portfolio system where the same structured data powers:
- Visual portfolio sections (home, about, skills, projects, credentials, contact)
- Project-aware AI assistant responses
- Voice-agent conversational mode

Main routes:
- `/` -> Standard portfolio experience
- `/voice-agent` -> Voice-first AI assistant experience

## Key Features
- Modular data-driven architecture for projects, credentials, and profile content
- Voice capture using browser Speech Recognition API
- AI response generation from `/api/ai` and `/api/assistant`
- Intent-aware voice answers for bio, education, projects, credentials, and contact
- External link command handling in voice mode (GitHub / LinkedIn / project repos)
- ElevenLabs TTS pipeline via `/api/tts`
- Client-side fallback to browser `speechSynthesis` when TTS API fails
- Contact form backend with validation and in-memory rate limiting (`/api/contact`)
- 3D and motion-enhanced UI (`three`, `@react-three/fiber`, `framer-motion`)
- Security and cache headers via `next.config.ts`

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS, Framer Motion, Lucide Icons
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **AI Providers:** Google Gemini API, OpenAI API
- **TTS:** ElevenLabs API (+ browser fallback)
- **Email:** Resend

## Project Structure
```text
app/
  api/
    ai/route.ts           # Voice-agent AI endpoint (intent + history)
    assistant/route.ts    # Project-aware assistant endpoint
    tts/route.ts          # ElevenLabs text-to-speech proxy
    contact/route.ts      # Contact form email sender
  page.tsx                # Portfolio page
  voice-agent/page.tsx    # Voice mode page

components/
  portfolio-shell.tsx     # Main shell and section composition
  voice/                  # Voice agent UI, input, output, chat
  scene/                  # 3D visual components
  interactive/            # Assistant panel, contact form, telemetry, diagrams

lib/
  mainData.ts             # Main profile + projects + credentials exports
  assistantPrompts.ts     # System prompts and suggestion prompts
  voiceAssistantData.ts   # Voice assistant knowledge base
  normalMode/             # Core project + credential datasets
  voiceMode/              # Voice project-specific long-form data

public/
  projectThumbnails/
  credentialImages/
  issuerLogos/
  3dModel/

prompts/
  fillProjectData.txt
  thumnailPrompt.txt
```

## Getting Started
### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Copy `.env.local.example` to `.env.local` and set real keys.

### 3) Run in development
```bash
npm run dev
```

Open `http://localhost:3000`.

### 4) Build for production
```bash
npm run build
npm start
```

## Environment Variables
Current `.env.local.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini

ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

Also required for contact email route:

```env
RESEND_API_KEY=your_resend_api_key_here
```

Optional/advanced:

```env
OPENAI_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=... # alternate key name for /api/ai fallback path
```

### Provider priority
- `/api/ai`: Gemini first, then OpenAI fallback
- `/api/assistant`: Gemini first, then OpenAI fallback
- If no provider key is configured, endpoints return structured fallback behavior/errors

## API Endpoints
### `POST /api/ai`
Voice-agent conversational endpoint.

Request body:
```json
{
  "message": "Tell me about your projects",
  "intent": "projects",
  "history": [{ "role": "user", "content": "..." }]
}
```

Notes:
- Requires `application/json`
- Validates input length and sanitizes history
- Returns `{ "reply": "..." }` or `{ "error": "..." }`

### `POST /api/assistant`
Project-focused assistant endpoint.

Request body:
```json
{
  "prompt": "What is the architecture?",
  "projectSlug": "ai-agent-portfolio-platform"
}
```

Notes:
- Validates request size, prompt length, and project slug
- Uses model provider if configured; otherwise deterministic fallback reply

### `POST /api/tts`
Text-to-speech endpoint.

Request body:
```json
{ "text": "Hello from my portfolio assistant." }
```

Notes:
- Uses ElevenLabs
- Returns `audio/mpeg` on success
- Returns JSON error on provider failure

### `POST /api/contact`
Contact form submission endpoint.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "projectType": "AI Web App",
  "message": "Let's collaborate"
}
```

Notes:
- Validates fields and email format
- Includes in-memory rate limiting (8 requests / 60s per IP key)
- Sends email via Resend

## How AI and Voice Work
1. User speaks or types in `VoiceAgent`.
2. For speech input, `VoiceInput` uses browser Speech Recognition (`en-US`).
3. Message + intent + recent history are sent to `/api/ai`.
4. Assistant reply is displayed in chat with typewriter rendering.
5. `speakText()` calls `/api/tts` for ElevenLabs audio.
6. If TTS fails, browser `speechSynthesis` is used as fallback.

Voice command behavior includes:
- Intent detection (bio, education, projects, certificates, badges, licenses, contact)
- Link actions (`open github`, `open linkedin`, project repo opening)

## Customize Your Portfolio Content
Update these files to personalize content:
- `lib/mainData.ts` -> profile intro, links, skills, focus areas, navigation
- `lib/normalMode/projects.ts` -> project cards and metadata
- `lib/normalMode/credentials.ts` -> certificates/badges/licenses
- `lib/voiceMode/projectData/*.ts` -> voice assistant long-form project knowledge
- `lib/voiceAssistantData.ts` -> unified voice assistant data graph
- `lib/assistantPrompts.ts` -> assistant system prompts and quick suggestions

Update static assets:
- `public/projectThumbnails/*`
- `public/credentialImages/*`
- `public/issuerLogos/*`
- `public/3dModel/*`

## Deployment Notes
- Uses security headers and CSP via `next.config.ts`
- Microphone input needs HTTPS in production (or localhost in development)
- For Resend in production, configure verified domain and sender policy
- Contact endpoint currently uses:
  - `from: Portfolio Contact <onboarding@resend.dev>`
  - `to: h.softwaredeveloper.project@gmail.com`

### Safe update flow (before production)
When you add a new project or credential, use this flow so your running site does not break:

1. Create a branch (example: `feature/add-new-project`).
2. Run local checks:

```bash
npm install
npm run lint
npm run build
npm run start
```

3. Verify these routes manually in browser:
  - `/`
  - `/voice-agent`
  - `/api/assistant` (with a valid POST body)
4. Push branch and open a Pull Request to `main`.
5. Wait for GitHub Actions:
  - `quality` job: lint + production build
  - `smoke-test` job: starts app and checks key routes
6. Merge only after all checks pass.

This repository workflow is configured to run on `main`, `develop`, and `feature/**` pushes, plus PRs into `main`.

You should update sender/recipient values in `app/api/contact/route.ts` for your own domain/inbox.

## Troubleshooting
- **Mic not working:** Ensure HTTPS, browser permission allowed, and supported SpeechRecognition API.
- **No AI response:** Check `GEMINI_API_KEY` or `OPENAI_API_KEY`.
- **No voice output:** Check `ELEVENLABS_API_KEY`; browser fallback should still speak if supported.
- **Contact form fails:** Verify `RESEND_API_KEY`, sender constraints, and recipient email.
- **Popup blocked for link commands:** Allow popups in browser settings.

## License
No license file is currently defined in this repository.
Add a `LICENSE` file (for example, MIT) if you want open-source distribution terms.

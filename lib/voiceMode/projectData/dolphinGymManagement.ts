import type { PortfolioProject } from "../../voiceAssistantData";

export const dolphinGymManagementProject: PortfolioProject = {
  name: "Dolphin Gym Management System with AI Chat and Live Training Foundation",
  summary:
    "A full-stack PHP/MySQL fitness platform with member operations, AI-powered fitness assistant, and WebRTC-ready live training foundations.",
  technologies: [
    "PHP",
    "MySQL/MariaDB",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Bootstrap 5",
    "Chart.js",
    "OpenAI Chat Completions API",
    "gpt-3.5-turbo",
    "cURL",
    "WebRTC",
    "navigator.mediaDevices.getUserMedia",
    "RTCPeerConnection",
    "Session-based Authentication"
  ],
  challenges: [
    "Building a unified platform where members, coaches, and admins each see relevant data and workflows.",
    "Integrating OpenAI Chat Completions into a traditional PHP request-response architecture while maintaining performance.",
    "Designing an AI assistant that understands gym-specific context (member workout history, fitness goals) without exposing sensitive data.",
    "Laying the foundation for voice interaction while shipping immediately with stable text-based AI.",
    "Managing real-time features like live session booking and order checkout alongside AI and media capabilities.",
    "Ensuring security across authentication, payment processing, and AI data handling."
  ],
  outcomes: [
    "Delivered a production-ready gym operations platform with authentication, workout logging, nutrition tracking, analytics, and admin dashboards.",
    "Implemented a working AI fitness assistant powered by OpenAI Chat Completions that understands member context and provides personalized guidance.",
    "Established browser-based media capture for future voice coaching using navigator.mediaDevices.getUserMedia and RTCPeerConnection infrastructure.",
    "Created clear architectural roadmap from current text AI to future realtime voice assistant.",
    "Built a scalable multi-role platform (member, coach, admin) that demonstrates full-stack delivery.",
    "Produced a strong portfolio project showing both shipping value today and technical roadmap for AI evolution."
  ],
  description_long:
    "Dolphin Gym Management System is a comprehensive fitness operations platform built with PHP and MySQL, extended with AI assistance and live media foundations.\n\nOn the product side, the system handles core gym workflows: member registration and authentication with session hardening, workout logging with exercise customization, calorie and BMI tracking with Chart.js visualizations, diet and nutrition management, live training session booking (coach availability + member scheduling), community features like forums and reviews, merchandise e-commerce with shopping cart and checkout, order management and tracking, support ticket system, and admin role dashboards.\n\nOn the AI side, the key production feature is a fitness assistant powered by OpenAI Chat Completions with the gpt-3.5-turbo model. When a member uses the AI chat, their input is validated server-side, the backend retrieves relevant context (member's fitness goals, recent workouts, dietary preferences), and sends a carefully crafted prompt to OpenAI that includes this context. The assistant responds with personalized fitness guidance—answering questions about form, diet, recovery, and motivation—without requiring the member to re-explain their situation every turn. The response is streamed back and rendered in the chat UI.\n\nOn the real-time media side, the system includes browser microphone and camera capture via navigator.mediaDevices.getUserMedia({ video: true, audio: true }). The live trainer page (for coaches) captures video and audio, streams it to a companion video element, and attempts WebRTC peer setup using RTCPeerConnection—generating an SDP offer intended for a signaling backend. The member side has corresponding receive logic. This creates visible media transport groundwork, but it stops before speech intelligence: there is no STT, no TTS, no audio preprocessing, and no completed signaling backend. So the system is best described as production-ready AI text chat with an intentional voice-transport skeleton.\n\nFuture upgrades would add: speech-to-text to transcribe live voice questions into the AI context, dedicated intent detection for actions like 'book a session' or 'log a workout', text-to-speech to deliver audio responses, and full end-to-end latency instrumentation. The current foundation makes those upgrades straightforward.",
  role:
    "Full-stack developer and AI integration architect. Responsible for backend PHP modules (user, workout, nutrition, payment), relational database design, OpenAI Chat Completions integration with context injection, browser media capture setup, and WebRTC-style peer initialization for live training.",
  demo_story:
    "Imagine you're a gym member who wants real-time guidance but can't afford a personal coach standing next to you all day. You log into Dolphin, chat with the AI assistant about your workout, and it gives you form tips, diet advice, and answers specific to your fitness goal and recent progress—because it sees your logged workouts and diet history. Coaches can run live sessions with video and audio (foundation there, voice routing coming next). Admins see analytics on gross revenue, member engagement, and top-selling products. Everything comes from one platform. The AI part is working today; the voice part is scaffolded for tomorrow.",
  keywords: [
    "gym management system",
    "fitness platform",
    "OpenAI integration",
    "AI fitness assistant",
    "member dashboard",
    "workout logging",
    "analytics and tracking",
    "live training",
    "WebRTC video",
    "ecommerce",
    "voice assistant roadmap",
    "PHP full-stack",
    "real-time coaching",
    "personalized fitness AI"
  ],
  faqs: [
    {
      question: "Is the AI fitness assistant live in production?",
      answer:
        "Yes. Members can chat with the AI assistant right now through the dashboard. The assistant has access to the member's fitness goals, recent workouts, and diet history, so it gives personalized advice without rehashing context every message. It's powered by OpenAI gpt-3.5-turbo and runs through a secure PHP backend."
    },
    {
      question: "What AI features are NOT implemented yet?",
      answer:
        "Speech-to-text (STT), text-to-speech (TTS), audio preprocessing, and a completed signaling backend for WebRTC live sessions. The infrastructure for capturing browser microphone and camera is there, and WebRTC peer setup begins, but there's no system handling the speech-to-text-to-AI-response-to-speech-to-audio pipeline yet. That's the next major upgrade."
    },
    {
      question: "How does the AI know it's giving fitness advice to my specific member?",
      answer:
        "When you (a member) chat, the backend looks up your profile, recent workouts, fitness goals, and dietary preferences. All of that context is included in the prompt sent to OpenAI, so the assistant tailors responses to you. It's like having a coach who's reviewed your progress file before answering."
    },
    {
      question: "What happens if OpenAI is slow or down?",
      answer:
        "The chat input stays responsive, but the user sees a graceful timeout message and can try again. There's no loss of data. Future improvements would add a local fallback or cached response tier so the assistant keeps working even if the API is temporarily unavailable."
    },
    {
      question: "Can coaches run live training sessions now?",
      answer:
        "Partially. Coaches can start a live session, capture video and audio from their device, and attempt to send it via WebRTC. Members can try to receive on the other side. The transport skeleton is there. But the backend signaling (exchanging SDP offer and answer, ICE candidates) is incomplete, so the full peer connection doesn't form yet. That's a near-term fix."
    },
    {
      question: "Why not just use a text voice bot instead of building voice media foundations?",
      answer:
        "Because gyms are inherently voice-first environments. A member using a treadmill can't type comfortably, but they can talk. Voice is the natural UX for fitness coaching. By building the transport skeleton now—even before STT and TTS are integrated—we signal that voice is a first-class citizen, not an afterthought. The AI backend is ready; we're just adding the speech plumbing."
    },
    {
      question: "What's the timeline to full voice assistant?",
      answer:
        "If you wanted to ship a working voice AI assistant on this platform, it would take roughly 2-4 weeks to: integrate an STT engine (Whisper, Google Cloud Speech), wire audio preprocessing and buffering, complete the WebRTC signaling backend, add TTS output (Google Cloud Text-to-Speech or similar), and instrument end-to-end telemetry. The hard parts (auth, AI context, multi-user messaging) are already solved."
    },
    {
      question: "Is this platform production-ready as-is?",
      answer:
        "Yes. The member dashboard, workout tracking, AI chat, forum, store, and admin analytics all work and are deployed. It's a fully operational gym platform today. The voice media parts are in-progress roadmap items, not blockers to customer value."
    }
  ],
  pipeline:
    "Member Text-Based: Member opens dashboard and starts AI chat -> Browser captures text input and sends to /api/ai endpoint via HTTPS POST as JSON -> Backend PHP receives request, validates input length and content, retrieves member profile (goals, recent workouts, diet history), constructs a system prompt with this context plus member message -> Backend calls OpenAI Chat Completions API (gpt-3.5-turbo) using cURL with system prompt + member message -> OpenAI returns structured response JSON -> Backend parses response and returns as JSON to frontend -> Frontend renders AI response in chat UI with timestamp. \n\nMember Voice-Based (Skeleton, Not Fully Implemented): Member indicates they want to ask a voice question -> Browser calls navigator.mediaDevices.getUserMedia({ audio: true, video: false }) to request microphone access -> User speaks question -> Browser captures audio samples (no preprocessing implemented, so raw audio samples flow directly) -> Currently stops here—no STT service is called. Future flow: Browser would send audio blob to /api/stt endpoint, STT engine transcribes to text, backend injects transcribed text into the AI context pipeline above, response becomes text TTS input.\n\nCoach Live Session (Skeleton, Not Fully Implemented): Coach initiates live session from admin panel -> Browser calls navigator.mediaDevices.getUserMedia({ video: true, audio: true }) to request camera and microphone -> Browser creates RTCPeerConnection and generates SDP offer -> For now, offer is logged but not sent anywhere (no signaling backend implemented) -> Companion member page also creates RTCPeerConnection but does not receive the offer, so no media actually flows. Future flow: Coach offer sent to signaling service, signaling service routes offer to member, member generates answer and sends back, ICE candidates exchanged, media stream connected.",
  latency:
    "Text AI latency: Member types, submits -> browser 20ms, HTTPS round-trip 50-200ms depending on network, backend validation 10ms, OpenAI request including API latency 1500-3000ms, response parsing 20ms, UI render 30ms. Total: 1.6-3.3 seconds from submit to visible response. \n\nVoice AI latency (incomplete but target): Microphone capture -> STT processing 500ms-3s depending on utterance length and STT engine, transcript to AI backend 100ms, OpenAI response 1500-2000ms, TTS synthesis 500ms-2s depending on response length, audio playback starts. Total future target: 3-7 seconds end-to-end. This assumes backend and signaling are optimized.\n\nLive session media latency (skeleton): Currently no media flows. Target for finished implementation: 200-500ms one-way video latency via optimized WebRTC with proper ICE and STUN server selection.",
  accuracy:
    "Text AI accuracy: Quality depends on OpenAI gpt-3.5-turbo and the fitness-specific system prompt. The system stays in-scope for fitness questions (workouts, diet, recovery) and politely declines off-topic requests. Context injection (member goals + history) improves relevance. No ground truth available, but user feedback will determine whether responses feel personalized and actionable. \n\nVoice AI accuracy (future, not implemented): STT accuracy will depend on microphone quality and background noise (common in gyms). Expected 90-98% accuracy with noise filtering. TTS accuracy (naturalness) depends on engine choice; modern TTS sounds nearly human. Intent detection accuracy for actions like 'book a session' will depend on training data.\n\nMedia accuracy (skeleton): No media flowing, so no quality metrics yet. Target is broadcast-quality video (720p+) and conversation-quality audio (16kHz) with low jitter.",
  optimizations: [
    "Complete the WebRTC signaling backend so coaches and members can actually exchange media.",
    "Integrate speech-to-text (e.g., OpenAI Whisper or Google Cloud Speech) so members can dictate voice questions.",
    "Add text-to-speech (e.g., Google Cloud TTS or Azure Speech) so AI responses can be read aloud.",
    "Implement audio preprocessing: noise cancellation, silence detection, gain normalization, resampling to 16kHz mono.",
    "Add intent detection layer that intercepts product actions ('book a session', 'log workout', 'order supplements') and routes them to deterministic handlers before invoking the LLM.",
    "Instrument end-to-end telemetry: capture start, STT latency, model response latency, TTS latency, network latency, user satisfaction signals.",
    "Create offline-capable sessions so voice questions can be cached and backfilled when network recovers.",
    "Add voice-specific UI: waveform visualization while listening, visual confidence score during transcription, interruption handling ('I've got two questions…').",
    "Implement graceful fallback to text chat if voice fails mid-session.",
    "Build coach-to-member voice coaching so coaches can provide real-time spoken feedback during live sessions without typing."
  ]
};


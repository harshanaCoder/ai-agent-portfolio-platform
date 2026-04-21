import type { ProjectData } from "../mainData";

export const projectCategories = ["AI Systems", "Web Products"] as const;

export const projects: ProjectData[] = [
  // AI Agent Portfolio Platform
  {
    "slug": "ai-agent-portfolio-platform",
    "category": ["Web Products", "AI Systems"],
    "title": "AI Agent Portfolio Platform",
    "tagline": "Interactive portfolio with voice and AI assistant",
    "summary": "This project is an advanced portfolio platform that combines traditional web browsing with an intelligent AI assistant and voice interaction layer. Built using Next.js and TypeScript, it transforms a static portfolio into a dynamic, conversational experience.The platform is structured around reusable, typed data modules that define projects, credentials, and personal information. These data sources power both the standard UI and an AI-driven assistant, ensuring consistent and context-aware responses. On the backend, dedicated API routes handle assistant queries, conversational voice interactions, text-to-speech generation, and secure contact submissions.The system integrates multiple AI providers, enabling flexible and reliable response generation with fallback mechanisms. Voice interaction is supported through browser-based speech recognition, while responses are delivered using external text-to-speech services with a built-in browser fallback for resilience.From a user experience perspective, the platform features a modern, animated interface enhanced with 3D visuals and smooth transitions. Users can either navigate traditionally or switch to voice mode to explore projects, ask questions, and interact with the portfolio in a more natural way.This project demonstrates a full-stack approach to modern web development, combining frontend design, API architecture, AI integration, and real-time interaction to create a next-generation personal portfolio experience.",
    "thumbnail": "/projectThumbnails/ai-agent-portfolio-platform.png",
    "github": "",
    "stack": [
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
    "assistantSeed": "This project is a full-stack AI portfolio interface with structured data retrieval, chat endpoints, and voice interaction.\nIt supports provider-based LLM replies, TTS playback with fallback, and guided exploration of projects, credentials, and contact details."
  },

  // CableGuard IoT Cable Tension and Fatigue Monitoring System
  {
    "slug": "cableguard-iot-monitoring-system",
    "category": ["Embedded Systems", "Mobile Apps", "Web Products"],
    "title": "CableGuard",
    "tagline": "Real-time cable tension and fatigue monitoring",
    "summary": "CableGuard is a full-stack IoT system designed to monitor cable health in real time by analyzing vibration data. It uses an ESP32 paired with an MPU6050 sensor to capture high-frequency acceleration signals and stream them via MQTT to a backend analytics engine.On the backend, a FastAPI-based pipeline processes incoming data through signal conditioning steps including noise filtering, drift removal, and frequency extraction using FFT. The system identifies the dominant vibration frequency and converts it into cable tension using a physics-based model. In parallel, fatigue damage is estimated using rainflow counting and Miner’s rule, enabling long-term structural health insights.The platform delivers both real-time and historical analytics. MongoDB stores device and history data, while Firebase and WebSocket streams provide live updates to interactive dashboards. A Flutter application allows users to manage devices, monitor live metrics such as tension and fatigue, and track remaining cable life through a clean and responsive interface.CableGuard demonstrates an end-to-end engineering approach, combining embedded systems, real-time data streaming, signal processing, and full-stack application development to solve a practical structural monitoring problem.",
    "thumbnail": "/projectThumbnails/cableguard-iot-monitoring-system.png",
    "github": "https://github.com/harshanaCoder/cableguard-iot-monitoring-system.git",
    "stack": ["ESP32", "MPU6050", "Python", "FastAPI", "MQTT", "MongoDB", "Firebase Realtime Database", "Flutter", "Docker", "NumPy", "SciPy"],
    "assistantSeed": "CableGuard is a full-stack IoT cable monitoring project combining ESP32 vibration sensing, FastAPI analytics, and Flutter/web dashboards.\nIt computes dominant frequency, tension, fatigue damage, and remaining life from live accelerometer streams."
  },

  // Smart IoT-Based Christmas LED Star
  {
    "slug": "smart-iot-christmas-led-star",
    "category": ["Embedded Systems", "IoT"],
    "title": "Smart IoT-Based Christmas LED Star",
    "tagline": "WiFi-controlled programmable LED star",
    "summary": "A smart IoT-based LED decoration system built using an ESP32 microcontroller and WS2812 addressable LEDs. The project features a custom-designed star with a flowing LED tail, capable of displaying dynamic lighting effects and animations.The system is powered by WLED firmware, enabling real-time control over WiFi through an intuitive web interface. Users can easily adjust colors, brightness, and effects without reprogramming the device.This project demonstrates practical experience in embedded systems, IoT-based control, LED programming, and hardware-software integration.",
    "thumbnail": "/projectThumbnails/smart-iot-christmas-led-star.png",
    "github": "https://github.com/harshanaCoder/smart-led-star-esp32-wled.git",
    "stack": ["ESP32", "WS2812 LEDs", "WLED", "WiFi"],
    "assistantSeed": "This project is an ESP32-based IoT LED system using WLED for real-time lighting control. It demonstrates integration of embedded hardware with a WiFi-based interface."
  },

  //  elebate safe AI Maintenance Portal
  {
    "slug": "elevatesafe-ai-maintenance-portal",
    "category": ["Web Products", "AI Systems"],
    "title": "ElevateSafe",
    "tagline": "AI-assisted elevator maintenance reporting and analytics with secure PHP workflows.",
    "summary": "ElevateSafe is a secure maintenance management portal for elevator and escalator operations built with PHP and MySQL. The repository implements authenticated breakdown submission, server-side validation, AI-assisted categorization using Google Gemini, admin-gated analytics, maintenance history review, and Excel export. The core production value comes from converting raw maintenance incidents into structured operational intelligence through a resilient backend that combines input sanitization, prepared statements, session hardening, login rate limiting, and fallback classification logic.For portfolio purposes, the most accurate framing is an AI-enhanced maintenance intelligence platform with a credible future path toward voice enablement.",
    "thumbnail": "/projectThumbnails/elevateSafe.png",
    "github": "https://github.com/harshanaCoder/ElevateSafe.git",
    "stack": [
      "PHP",
      "MySQL",
      "Google Gemini API",
      "Bootstrap 5",
      "Chart.js",
      "PhpSpreadsheet",
      "SweetAlert2",
      "JavaScript",
      "HTML",
      "CSS"
    ],
    "assistantSeed": "ElevateSafe is an AI-assisted maintenance intelligence portal for elevator operations. Describe it as a secure system where technicians log structured breakdown reports, the backend validates all inputs, Gemini classifies the incident into a fixed maintenance taxonomy, and the analytics layer surfaces trends, top faulty units, and executive summaries. Be precise that the repository is text-driven today and does not contain a true implemented voice pipeline, while still explaining how the current AI service and backend architecture could support a future voice interface."
  },

  // Dolphin gym management System
  {
    slug: "dolphin-gym-management-system-ai-chat-live-training",
    category: ["Web Products"],
    title: "Dolphin Gym Management System with AI Chat and WebRTC-Ready Live Training",
    tagline:
      "A PHP and MySQL fitness platform with gym operations, analytics, AI chat, and a partial browser voice-media foundation.",
    summary:
      "Dolphin Gym Management System is a full-stack web platform built with PHP, MySQL and modern frontend technologies. It features a public website, member dashboard, and admin panel supporting workflows like user authentication, workout and diet tracking, BMI and calorie analytics, forums, live session booking, e-commerce, and order management.An integrated AI fitness assistant uses the OpenAI API to provide real-time text-based guidance through a secure backend pipeline. The system also includes an initial WebRTC-based live training module for video/audio streaming, forming the foundation for a future real-time voice assistant.Currently production-ready as a gym management and AI-powered platform, the project demonstrates scalable architecture and a clear roadmap toward a fully interactive voice-enabled fitness assistant.",
    thumbnail: "/projectThumbnails/dolphin_gym_management_system.png",
    github: "https://github.com/harshanaCoder/Dolphin-Gym-Management-System.git",
    stack: [
      "PHP",
      "MySQL",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Chart.js",
      "cURL",
      "OpenAI Chat Completions API",
      "Session-based Authentication"
    ],
    assistantSeed:
      "You are the Dolphin Fitness Assistant. Explain this project as a full-stack gym management platform with implemented text AI, rich operational modules, and a partial voice pipeline based on browser media capture and RTCPeerConnection setup. Be precise that STT, TTS, preprocessing, and signaling backend pieces are not fully implemented in the checked-in repository."
  }
];

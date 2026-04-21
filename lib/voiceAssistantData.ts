import {
  assistantProfile,
  contactLinks,
  credentials,
  focusAreas,
  projects as corePortfolioProjects,
  resumeHref,
  type AssistantProfile,
  type CredentialData,
  type FocusArea,
  type ProjectData
} from "./mainData";
import { portfolioProjects } from "./voiceMode";

export type PortfolioProject = {
  name: string;
  summary: string;
  description_long: string;
  role: string;
  technologies: string[];
  challenges: string[];
  optimizations: string[];
  outcomes: string[];
  demo_story: string;
  keywords: string[];
  pipeline?: string;
  latency?: string;
  accuracy?: string;
  faqs: {
    question: string;
    answer: string;
  }[];
};

export type FAQ = {
  question: string;
  answer: string;
};

export type PortfolioSkill = {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;

  // AI reasoning enhancement
  used_in_projects?: string[];
};

export type Education = {
  degree: string;
  institute: string;
  description: string;
  focus?: string[];
};

export type Achievement = {
  title: string;
  description: string;
  impact?: string;
};

export type PortfolioData = {
  name: string;
  title: string;
  bio: {
    fullName: string;
    currentRole: string;
    summary: string;
  };
  intro: string;
  personality: string;
  education: Education[];
  journey: string;
  journey_story: string;
  skills: PortfolioSkill[];
  projects: PortfolioProject[];
  coreProjects: ProjectData[];
  credentials: {
    all: CredentialData[];
    certificates: CredentialData[];
    badges: CredentialData[];
    licenses: CredentialData[];
  };
  contact: {
    links: typeof contactLinks;
    resumeHref: string;
  };
  assistantProfile: AssistantProfile;
  focusAreas: FocusArea[];
  achievements: Achievement[];
  keywords: string[];
  faqs: FAQ[];
};


export const portfolioData: PortfolioData = {
  name: "Janith Harshana",
  title: "AI & Robotics Engineer",
  bio: {
    fullName: "Janith Harshana",
    currentRole: "AI & Robotics Engineer",
    summary:
      "Engineer focused on AI, robotics, embedded systems, and practical full-stack products with real-world reliability."
  },

  // ─────────────────────────────
  // Identity Layer
  // ─────────────────────────────
  intro:
    "I'm Janith Harshana, an AI and robotics engineer focused on building real-world systems that combine intelligence, embedded control, and full-stack software.",
  personality:
    "I think like a systems engineer — practical, hands-on, and focused on reliability, architecture, and real-world constraints rather than just theory.",

  // ─────────────────────────────
  // Education Layer
  // ─────────────────────────────
  education: [
    {
      degree: "Software & Systems Engineering Focus",
      institute: "Self-driven + Project-based Engineering Path",
      description:
        "Focused on AI systems, robotics, embedded control, and scalable software engineering through hands-on projects.",
      focus: ["AI", "Robotics", "Embedded Systems", "System Design"]
    }
  ],

  // ─────────────────────────────
  // Journey Layer
  // ─────────────────────────────
  journey:
    "I evolved by building real systems across AI, robotics, and embedded engineering, focusing on how software interacts with physical systems.",
  journey_story:
    "My journey started with curiosity about how machines think and move. I built ESP32-based systems, then progressed into robotics and AI pipelines. Over time, I learned that real engineering is about reliability, constraints, and clear system design — not just functionality.",

  // ─────────────────────────────
  // Skill Graph (AI-Friendly)
  // ─────────────────────────────
  skills: [
    {
      name: "AI Systems",
      level: "advanced",
      description:
        "Designing AI-driven workflows, intelligent assistants, and real-time inference systems.",
      used_in_projects: ["AI Assistant", "Vision Systems"]
    },
    {
      name: "Robotics & Embedded Systems",
      level: "advanced",
      description:
        "Building ESP32-based control systems, sensor integration, and real-time robotics logic.",
      used_in_projects: ["Drone System", "Autonomous Control"]
    },
    {
      name: "Computer Vision",
      level: "intermediate",
      description:
        "Object detection, tracking, and perception pipelines using OpenCV and ML models.",
      used_in_projects: ["Vision Tracking System"]
    },
    {
      name: "Full-Stack Engineering",
      level: "advanced",
      description:
        "Next.js, TypeScript, APIs, UI systems, and cloud deployment.",
      used_in_projects: ["Portfolio System"]
    },
    {
      name: "System Design",
      level: "advanced",
      description:
        "Architecture design, telemetry systems, observability, and scalable system thinking.",
      used_in_projects: ["All Projects"]
    }
  ],

  // ─────────────────────────────
  // Projects (AI Brain Core)
  // ─────────────────────────────
  projects: portfolioProjects,
  coreProjects: corePortfolioProjects,

  credentials: {
    all: credentials,
    certificates: credentials.filter((item) => item.category === "Certificate"),
    badges: credentials.filter((item) => item.category === "Badge"),
    licenses: credentials.filter((item) => item.category === "License")
  },

  contact: {
    links: contactLinks,
    resumeHref
  },

  assistantProfile,
  focusAreas,

  // ─────────────────────────────
  // Achievements (Impact Layer)
  // ─────────────────────────────
  achievements: [
    {
      title: "Cross-Domain Engineering",
      description:
        "Built systems combining AI, robotics, embedded systems, and web engineering into unified solutions.",
      impact: "Demonstrates full-stack engineering capability across domains"
    },
    {
      title: "System Architecture Thinking",
      description:
        "Designed modular, observable systems with clear boundaries and debugging visibility.",
      impact: "Improves maintainability and scalability of real systems"
    },
    {
      title: "Real-World Engineering Focus",
      description:
        "Prioritized reliability, constraints, and system behavior over theoretical perfection.",
      impact: "Ensures systems work under real-world conditions"
    }
  ],

  // ─────────────────────────────
  // AI Retrieval Layer
  // ─────────────────────────────
  keywords: [
    "AI systems",
    "robotics",
    "embedded systems",
    "ESP32",
    "autonomous systems",
    "computer vision",
    "full-stack development",
    "system design",
    "real-time systems",
    "telemetry",
    "automation",
    "edge AI"
  ],

  // ─────────────────────────────
  // Conversational Memory Layer
  // ─────────────────────────────
  faqs: [
    {
      question: "What makes you different as an engineer?",
      answer:
        "I build full systems across AI, robotics, and embedded domains, focusing on real-world constraints, architecture clarity, and reliability."
    },
    {
      question: "What do you focus on most?",
      answer:
        "I focus on building systems that work in real environments — not just demos — with strong architecture and predictable behavior."
    },
    {
      question: "What is your engineering strength?",
      answer:
        "Connecting multiple domains — hardware, AI, and software — into unified, working systems."
    },
    {
      question: "What challenges you the most?",
      answer:
        "Building robust systems when real-world inputs are noisy, uncertain, or unstable."
    }
  ]
};
import { credentials } from "./normalMode/credentials";
import { projects } from "./normalMode/projects";

export type FocusArea = {
  title: string;
  description: string;
};

export type SkillCategory = {
  title: string;
  accent: string;
  items: string[];
};

export type Metric = {
  label: string;
  value: string;
};

export type DiagramNode = {
  id: string;
  label: string;
  description: string;
  kind: "sensor" | "ai" | "embedded" | "control" | "actuator" | "monitor";
  x: number;
  y: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
};

export type TelemetryPreset = {
  battery: number;
  cpu: number;
  signal: number;
  temperature: number;
  latency: number;
};

export type ProjectData = {
  slug: string;
  category: string[];
  title: string;
  tagline: string;
  summary: string;
  thumbnail: string;
  model3d?: {
    glb: string;
    usdz?: string;
    alt?: string;
  };
  github: string;
  stack: string[];
  assistantSeed: string;
};

export type CredentialCategory = "Certificate"| "Project Certificate" | "Badge" | "License";

export type CredentialData = {
  slug: string;
  title: string;
  issuer: string;
  issuerColor: string;
  issuerLogo?: string;
  issueDate: string;
  credentialUrl: string;
  badgeImage?: string;
  certificateImage?: string;
  category: CredentialCategory;
  skills: string[];
};

export type AssistantProfile = {
  name: string;
  role: string;
  intro: string;
  interests: string[];
  strengths: string[];
  perspectives: {
    student: string;
    client: string;
    developer: string;
  };
};

export const navigationItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
  { id: "voice-agent", label: "Voice Agent" }
];

export const heroMetrics: Metric[] = [
  { label: "Systems Built", value: "12+" },
  { label: "Domains", value: "AI + Embedded" },
  { label: "Build Focus", value: "Real-world Automation" }
];

export const assistantProfile: AssistantProfile = {
  name: "Janith Harshana",
  role: "AI and Robotics Engineer",
  intro:
    "I am Janith Harshana, an engineer focused on AI, robotics, embedded systems, and practical web products that solve real problems.",
  interests: ["AI systems", "robotics", "embedded control", "computer vision", "automation"],
  strengths: ["system design", "hands-on prototyping", "debugging", "product thinking"],
  perspectives: {
    student:
      "As a student, I focus on learning by building: every project shows how I combine theory, experiments, and implementation to understand systems deeply.",
    client:
      "As a client-facing builder, I emphasize outcomes, reliability, and clarity so the solution is understandable, maintainable, and useful in the real world.",
    developer:
      "As a developer, I care about architecture, tradeoffs, interfaces, telemetry, and how each layer stays testable and predictable under real constraints."
  }
};

export const focusAreas: FocusArea[] = [
  {
    title: "AI Systems",
    description: "Designing AI-powered applications, real-time data processing systems, and intelligent automation solutions."
  },
  {
    title: "Embedded Systems",
    description: "Building ESP32-based systems, sensor integration, and real-time device communication."
  },

  {
    title: "Robotics",
    description: "Creating interactive systems that combine software logic with physical components and automation."
  },
  {
    title: "Computer Vision",
    description: "Exploring vision-based AI applications and real-time detection systems."
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    accent: "from-cyan-400/30 to-sky-500/10",
    items: ["Python", "C++", "JavaScript", "C", "Flutter/Dart"]
  },
  {
    title: "Artificial Intelligence",
    accent: "from-violet-500/30 to-fuchsia-500/10",
    items: ["Machine Learning", "Computer Vision (YOLO)"]
  },
  {
    title: "Embedded & Robotics",
    accent: "from-emerald-400/30 to-cyan-400/10",
    items: ["ESP32 / Arduino", "Sensor Fusion", "Motor Control & Actuators", "Communication Protocols (UART / I2C / SPI)"]
  },
  {
    title: "Mobile & UI Development",
    accent: "from-pink-400/30 to-rose-400/10",
    items: ["Flutter / Dart", "Cross-Platform UI Development", "Realtime Data Visualization"]
  },
  {
    title: "DevOps & Tools",
    accent: "from-amber-300/20 to-yellow-400/10",
    items: ["Git / GitHub", "Docker", "CI/CD Pipelines", "Vercel / Cloud Deployment"]
  },
  {
    title: "Automation & Systems Integration",
    accent: "from-purple-400/20 to-indigo-400/10",
    items: ["IoT System Design", "Sensor-Based Automation", "Realtime Monitoring", "End-to-End Embedded & Software Integration"]
  }
];

export { projects, credentials };

export const contactLinks = [
  { label: "Email", href: "mailto:janith.harshana.dev@gmail.com", value: "janith.harshana.dev@gmail.com", color: "#14b8a6" },
  { label: "GitHub", href: "https://github.com/harshanaCoder", value: "@harshanaCoder", color: "#ffffff" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/janith-harshana-1671633b3", value: "in/janith-harshana", color: "#0077B5" }
];

export const resumeHref = "/janith-harshana-resume.txt";

export function findProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug) ?? projects[0];
}
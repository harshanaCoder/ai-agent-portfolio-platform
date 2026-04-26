"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";

type HeroSectionProps = {
  mode: "portfolio" | "voice";
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

export function HeroSection({ mode, onPrimaryAction, onSecondaryAction }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const springHover = {
    type: "spring",
    stiffness: 360,
    damping: 24,
    mass: 0.8
  } as const;

  const focusPillars = [
    "AI application development",
    "Embedded systems & real-time software",
    "Intelligent automation & IoT systems"
  ];

  const isVoiceMode = mode === "voice";

  return (
    <div className="relative z-10 grid grid-cols-1 min-h-[clamp(18rem,70vh,46rem)] gap-6 px-4 py-8 sm:gap-9 sm:px-8 sm:py-14 lg:grid-cols-[1.16fr_0.84fr] lg:items-end lg:px-12 lg:py-16 xl:px-16">
      <motion.div
        className="w-full min-w-0 space-y-5 sm:space-y-7 lg:max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <p className="font-display text-sm uppercase tracking-[0.22em] text-[color:var(--text-soft)] lg:text-lg">
            Janith Harshana
          </p>
          <h1 className="text-balance max-w-[12ch] text-[clamp(1.85rem,8vw,6.4rem)] font-bold leading-[1.02] text-white">
            Intelligent{" "}
            <span className="block bg-gradient-to-r from-teal-200 via-teal-300 to-amber-200 bg-clip-text text-transparent">
              Systems Developer
            </span>
          </h1>
          <p className="text-base font-semibold text-[color:var(--text)] sm:max-w-[38ch] sm:text-xl lg:text-3xl">
            Building AI-Driven Solutions for Real-World Systems
          </p>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-sm leading-7 text-[color:var(--text-soft)] sm:text-base sm:max-w-[56ch] sm:leading-8 lg:text-xl lg:leading-9 break-words overflow-wrap-anywhere"
        >
          {isVoiceMode
            ? "You are now in voice agent mode. Ask the digital twin to guide you through my skills, projects, achievements, or the story behind specific engineering decisions."
            : "I’m a Software Engineering student and aspiring AI Engineer focused on building intelligent, real-world applications. I develop AI-driven systems, IoT solutions, and automation tools that connect software with physical environments.My work combines software development, embedded systems, and system-level thinking to transform ideas into functional prototype"}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
          <motion.button
            type="button"
            onClick={onPrimaryAction}
            className="button-primary"
            aria-label="View Projects"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={springHover}
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={onSecondaryAction}
            className="button-secondary"
            aria-label={isVoiceMode ? "Return to portfolio mode" : "Talk to My AI"}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={springHover}
          >
            {isVoiceMode ? "Back to Portfolio Mode" : "Talk to My AI"}
            <Bot className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.aside
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 w-full min-w-0 lg:pb-1"
      >
        <motion.div variants={itemVariants} className="glass-panel interactive-card rounded-2xl p-5 sm:p-6">
          <p className="eyebrow-label">{isVoiceMode ? "Voice focus" : "Current Focus"}</p>
          <ul className="mt-4 grid gap-3">
            {focusPillars.map((item) => (
              <motion.li
                key={item}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="rounded-xl border border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] px-4 py-3 text-sm text-[color:var(--text)] sm:text-base lg:text-lg"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel interactive-card rounded-2xl p-5 sm:p-6">
          <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--text-soft)] lg:text-base">Interaction Hint</p>
          <p className="mt-3 text-base leading-7 text-[color:var(--text)] lg:text-lg lg:leading-8">
            {isVoiceMode
              ? "Use the voice guide to ask follow-up questions and jump between skills, projects, and journey details naturally."
              : "Explore my projects to see how I design, build, and deploy real-world AI and software systems."}
          </p>
        </motion.div>
      </motion.aside>
    </div>
  );
}
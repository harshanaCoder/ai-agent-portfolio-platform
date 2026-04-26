"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import type { ProjectData } from "@/lib/mainData";
import { HeroSection } from "@/sections/hero-section";
import { ProjectsSection } from "@/sections/projects-section";
import { SiteHeader } from "@/components/ui/site-header";

// ── Dynamically import below-the-fold sections ─────────────────────────
// These are not needed until the user scrolls, so we defer their JS.
const AboutSection = dynamic(
  () => import("@/sections/about-section").then((m) => m.AboutSection),
  { ssr: true }
);
const SkillsSection = dynamic(
  () => import("@/sections/skills-section").then((m) => m.SkillsSection),
  { ssr: true }
);
const CredentialsSection = dynamic(
  () => import("@/sections/credentials-section").then((m) => m.CredentialsSection),
  { ssr: true }
);
const ContactSection = dynamic(
  () => import("@/sections/contact-section").then((m) => m.ContactSection),
  { ssr: true }
);

// ── 3D background — not needed for SSR ────────────────────────────────
const NeuralHeroBackground = dynamic(
  () => import("@/components/scene/neural-hero-background").then((mod) => mod.NeuralHeroBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(47,224,200,0.12),transparent_45%)]" />
  }
);

const sectionMotion = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1]
    }
  }
} as const;

type NavigationItem = {
  id: string;
  label: string;
};

type PortfolioShellProps = {
  navigationItems: NavigationItem[];
  projects: ProjectData[];
};

export function PortfolioShell({ navigationItems, projects }: PortfolioShellProps) {
  const router = useRouter();
  const selectedProjectSlug = projects[0]?.slug ?? "";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-20 opacity-75">
        <div className="absolute inset-0 subtle-grid [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
        <div className="absolute -top-28 left-[12%] h-[22rem] w-[22rem] rounded-full bg-teal-300/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[6%] h-[20rem] w-[20rem] rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <SiteHeader navigationItems={navigationItems} />

      <main className="section-stack pb-20 pt-24 sm:pt-28">
        <section id="home" className="container-shell relative">
          <div className="hero-shell relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,106,0.12),transparent_36%),linear-gradient(120deg,rgba(47,224,200,0.1),transparent_42%)]" />
            <NeuralHeroBackground />
            <HeroSection
              mode="portfolio"
              onPrimaryAction={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              onSecondaryAction={() => {
                router.push("/voice-agent");
              }}
            />
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="section-stack"
        >
          <div className="container-shell section-stack">
            <motion.div variants={sectionMotion} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <AboutSection />
            </motion.div>

            <motion.div variants={sectionMotion} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <SkillsSection />
            </motion.div>

            <div>
              <ProjectsSection
                projects={projects}
                activeSlug={selectedProjectSlug}
              />
            </div>

            <motion.div variants={sectionMotion} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
              <CredentialsSection />
            </motion.div>
          </div>

          <motion.div
            variants={sectionMotion}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="container-shell"
          >
            <ContactSection />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

import { Download, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

import { ContactForm } from "@/components/interactive/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { contactLinks, resumeHref } from "@/lib/mainData";

const iconMap = {
  Email: Mail,
  GitHub: Github,
  LinkedIn: Linkedin
};

export function ContactSection() {
  return (
    <section id="contact" className="section-bg">
      <SectionHeading
        eyebrow="Contact & Resume"
        title="Build something ambitious together"
        description="Available for software engineering projects involving AI, embedded systems, and real-time applications. Share your requirements, and I’ll design a practical, efficient solution from concept to implementation."
        action={
          <motion.a
            href={resumeHref}
            download
            className="button-primary"
            aria-label="Download Resume File"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.8 }}
          >
            <Download className="h-4 w-4" />
            Download Resume File
          </motion.a>
        }
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="grid gap-4">
          {contactLinks.map((link) => {
            const Icon = iconMap[link.label as keyof typeof iconMap] ?? Mail;
            const color = (link as { color?: string }).color || "#ffffff";

            return (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                className="group relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[rgba(15,23,31,0.6)] p-4 transition-all duration-300 hover:border-[color:var(--line-strong)] hover:shadow-lg sm:p-6"
                aria-label={`Contact via ${link.label}`}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ y: -1, scale: 0.99 }}
                transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.85 }}
              >
                <div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[40px] opacity-0 transition-opacity duration-300 group-hover:opacity-20"
                  style={{ background: color }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                      style={{
                        borderColor: `${color}40`,
                        background: `radial-gradient(circle at top left, ${color}15, transparent)`,
                        color,
                        boxShadow: `0 0 15px ${color}10`
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">
                        {link.label}
                      </p>
                      <p
                        className="mt-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 sm:text-base"
                        style={{ textShadow: `0 0 10px ${color}00` }}
                      >
                        <span
                          className="block truncate group-hover:text-shadow-sm group-hover:duration-300"
                          style={{ textShadow: `0 0 12px ${color}40` }}
                        >
                          {link.value}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="-translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <svg
                      className="h-5 w-5 text-[color:var(--text-soft)] group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="glass-panel rounded-[22px] border border-white/8 p-5 sm:p-6 lg:p-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

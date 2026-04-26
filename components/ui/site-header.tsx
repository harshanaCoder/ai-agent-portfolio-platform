"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  navigationItems: Array<{ id: string; label: string }>;
};

export function SiteHeader({ navigationItems }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(navigationItems[0]?.id ?? "home");

  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topVisible = visibleEntries[0];
        if (topVisible?.target?.id) {
          setActiveId(topVisible.target.id);
        }
      },
      {
        rootMargin: "-46% 0px -42% 0px",
        threshold: [0.1, 0.25, 0.45, 0.65]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navigationItems]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container-shell relative">
        <div className="flex h-[var(--header-height)] w-full items-center justify-between rounded-full border border-[color:var(--line)] bg-[rgba(11,17,23,0.84)] px-3 shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors duration-300 sm:px-5 lg:px-6">
          <a
            href="#home"
            className="group flex min-w-0 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-3"
            aria-label="Home"
          >
            <div className="icon-bob relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-teal-300/30 bg-teal-300/10 ring-1 ring-white/5 sm:h-10 sm:w-10">
              <Image
                src="/icon.svg"
                alt="Janith Harshana logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-[0.04em] text-white sm:text-base lg:text-lg">JANITH HARSHANA</p>
              <p className="hidden text-sm text-[color:var(--text-soft)] sm:block lg:text-base">AI & Embedded Systems Builder</p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => {
              const isActive = item.id === activeId;
              const isVoiceAgentLink = item.id === "voice-agent";
              const href = isVoiceAgentLink ? "/voice-agent" : `#${item.id}`;

              return (
                <a
                  key={item.id}
                  href={href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-base font-medium transition-colors duration-200 xl:text-lg",
                    isActive
                      ? "text-white"
                      : "text-[color:var(--text-soft)] hover:bg-white/5 hover:text-white"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
                    />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <motion.button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="micro-press inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--text)] sm:h-11 sm:w-11 lg:hidden"
            onClick={() => setOpen((current) => !current)}
            whileTap={{ scale: 0.94 }}
          >
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={open ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" } : { opacity: 0, y: -12, scale: 0.98, pointerEvents: "none" }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
          className="absolute inset-x-0 top-[calc(var(--header-height)+0.7rem)] mx-1 rounded-2xl border border-[color:var(--line)] bg-[rgba(11,17,23,0.96)] p-4 shadow-[var(--shadow-md)] backdrop-blur-xl lg:hidden"
        >
          <nav className="grid gap-2 border-b border-[color:var(--line)] pb-4">
            {navigationItems.map((item) => {
              const isActive = item.id === activeId;
              const isVoiceAgentLink = item.id === "voice-agent";
              const href = isVoiceAgentLink ? "/voice-agent" : `#${item.id}`;

              return (
                <a
                  key={item.id}
                  href={href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-[color:var(--text-soft)] hover:bg-white/5 hover:text-white"
                  )}
                  onClick={handleNavClick}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </motion.div>
      </div>
    </header>
  );
}

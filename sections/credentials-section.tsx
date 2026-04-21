"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Award,
  BadgeCheck,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
} from "lucide-react";

import { credentials, type CredentialCategory, type CredentialData } from "@/lib/mainData";
import { SectionHeading } from "@/components/ui/section-heading";

/* ── helpers ─────────────────────────────────────────────────────────── */

const categoryMeta: Record<
  CredentialCategory,
  { icon: typeof Award }
> = {
  Certificate: { icon: Award },
  "Project Certificate": { icon: Award },
  Badge:       { icon: BadgeCheck },
  License:     { icon: ShieldCheck },
};

const fallbackCategoryMeta = { icon: Award };

function getIssuerInitials(issuer: string): string {
  const map: Record<string, string> = {
    "Amazon Web Services": "AWS",
    "Open Robotics": "ROS",
    IBM: "IBM",
  };
  return map[issuer] || issuer.charAt(0);
}

const filterCategories = ["All", "Certificate", "Project Certificate", "Badge", "License"] as const;

/* ── animation variants ──────────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

/* ── component ───────────────────────────────────────────────────────── */

export function CredentialsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showAllCredentials, setShowAllCredentials] = useState(false);
  const [previewCred, setPreviewCred] = useState<CredentialData | null>(null);

  const INITIAL_CREDENTIAL_COUNT = 6;

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? credentials
        : credentials.filter((c) => c.category === activeFilter),
    [activeFilter],
  );

  const visibleCredentials = showAllCredentials
    ? filtered
    : filtered.slice(0, INITIAL_CREDENTIAL_COUNT);
  const hasMoreCredentials = filtered.length > INITIAL_CREDENTIAL_COUNT;

  /* lock body scroll while modal is open */
  useEffect(() => {
    if (previewCred) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewCred]);

  const closePreview = useCallback(() => setPreviewCred(null), []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closePreview]);

  return (
    <>
      <section id="credentials" className="section-bg">
        <SectionHeading
          eyebrow="Credentials"
          title="Certificates, badges, and professional licenses"
          description="Verified credentials that validate expertise across AI, embedded systems, robotics, and modern development tools."
        />

        {/* ── Filter tabs ─────────────────────────────────────────── */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:gap-3">
          {filterCategories.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => {
                setActiveFilter(cat);
                setShowAllCredentials(false);
              }}
              aria-pressed={cat === activeFilter}
              whileTap={{ scale: 0.95 }}
              className={`min-w-fit rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 lg:text-base ${
                cat === activeFilter
                  ? "border-teal-300/40 bg-teal-300/15 text-white"
                  : "border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] text-[color:var(--text-soft)] hover:border-[color:var(--line-strong)] hover:text-white"
              } micro-press`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* ── Credential cards grid ───────────────────────────────── */}
        <motion.div
          layout
          className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <AnimatePresence mode="popLayout">
            {visibleCredentials.map((cred) => {
              const meta = categoryMeta[cred.category] ?? fallbackCategoryMeta;
              const IconComponent = meta.icon;
              const initials = getIssuerInitials(cred.issuer);
              const color = cred.issuerColor;
              const hasIssuerLogo = Boolean(cred.issuerLogo);

              return (
                <motion.article
                  key={cred.slug}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 26,
                    mass: 0.85,
                  }}
                  className="group glass-panel interactive-card overflow-hidden rounded-2xl relative"
                >
                  {/* ─ Top accent gradient bar ─ */}
                  <div
                    className="h-[3px] w-full"
                    style={{
                      background: `linear-gradient(90deg, ${color}, ${color}60, transparent)`,
                    }}
                  />

                  <div className="flex flex-col gap-5 p-5 sm:p-6">
                    {/* ─ Issuer monogram ─ */}
                    <div className="flex items-center justify-center pt-2">
                      <div className="relative">
                        {/* glow halo */}
                        <div
                          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-25 transition-opacity duration-500 group-hover:opacity-50"
                          style={{ background: color }}
                        />
                        {/* circle */}
                        <div
                          className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                          style={{
                            borderColor: `${color}50`,
                            background: `radial-gradient(circle at 30% 30%, ${color}22, ${color}08)`,
                            boxShadow: `0 0 24px ${color}18`,
                          }}
                        >
                          {hasIssuerLogo ? (
                            <img
                              src={cred.issuerLogo}
                              alt={`${cred.issuer} logo`}
                              className="h-10 w-10 object-contain"
                            />
                          ) : (
                            <span
                              className="select-none text-2xl font-bold tracking-tight"
                              style={{ color }}
                            >
                              {initials}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ─ Category pill ─ */}
                    <div className="flex justify-center">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] sm:text-xs"
                        style={{
                          borderColor: `${color}35`,
                          background: `${color}14`,
                          color,
                        }}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                        {cred.category}
                      </span>
                    </div>

                    {/* ─ Text content ─ */}
                    <div className="space-y-1.5 text-center">
                      <p
                        className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] sm:text-xs"
                        style={{ color: `${color}cc` }}
                      >
                        {cred.issuer}
                      </p>
                      <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
                        {cred.title}
                      </h3>
                      <p className="text-sm text-[color:var(--text-soft)]">
                        Issued {cred.issueDate}
                      </p>
                    </div>

                    {/* ─ Skills ─ */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {cred.skills.map((skill) => (
                        <span key={skill} className="tag-chip text-xs sm:text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* ─ Action buttons ─ */}
                    <div className="mt-auto flex gap-3 pt-1">
                      <a
                        href={cred.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="button-secondary flex-1 justify-center text-sm"
                        aria-label={`Verify ${cred.title} credential`}
                      >
                        Verify Credential
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      {cred.certificateImage && (
                        <button
                          type="button"
                          onClick={() => setPreviewCred(cred)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] px-3.5 text-[color:var(--text-soft)] transition-all duration-300 hover:border-teal-300/40 hover:bg-teal-300/10 hover:text-white"
                          aria-label={`View ${cred.title} certificate`}
                          title="View Certificate"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ── Show More / Show Less toggle ─────────────────────────── */}
        {hasMoreCredentials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              type="button"
              onClick={() => setShowAllCredentials((prev) => !prev)}
              className="group flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] px-6 py-3 text-sm font-medium text-[color:var(--text-soft)] transition-all duration-300 hover:border-teal-300/40 hover:bg-teal-300/10 hover:text-white lg:text-base"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 24 }}
            >
              {showAllCredentials ? (
                <>
                  Show Less
                  <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                </>
              ) : (
                <>
                  Show All Credentials ({filtered.length})
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* ── Empty state ─────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 rounded-2xl border border-dashed border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] p-8 text-center"
          >
            <p className="text-lg text-[color:var(--text-soft)]">
              No credentials found in this category.
            </p>
          </motion.div>
        )}
      </section>

      {/* ── Certificate Preview Modal ─────────────────────────────── */}
      <AnimatePresence>
        {previewCred?.certificateImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={closePreview}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* content */}
            <motion.div
              className="relative z-10 flex max-h-[90vh] max-w-4xl flex-col items-center"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* close button */}
              <button
                type="button"
                onClick={closePreview}
                className="absolute -right-3 -top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white"
                aria-label="Close certificate preview"
              >
                <X className="h-5 w-5" />
              </button>

              {/* certificate image */}
              <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                <img
                  src={previewCred.certificateImage}
                  alt={`${previewCred.title} certificate`}
                  className="max-h-[80vh] w-auto object-contain"
                />
              </div>

              {/* caption */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg font-semibold text-white">
                  {previewCred.title}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {previewCred.issuer} · {previewCred.issueDate}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

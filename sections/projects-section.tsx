"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers3, ChevronDown, ChevronUp } from "lucide-react";

import type { ProjectData } from "@/lib/mainData";
import { SectionHeading } from "@/components/ui/section-heading";

const ModelViewerModal = dynamic(
  () => import("../components/scene/model-viewer-modal").then((m) => m.ModelViewerModal),
  { ssr: false }
);

type ProjectsSectionProps = {
  projects: ProjectData[];
  activeSlug: string;
};

function sanitizeImageSrc(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  // Accept absolute/relative image URLs with a real image extension.
  const validImagePathPattern = /^(https?:\/\/.+|(\/|\.\/|\.\.\/).+)\.(png|jpe?g|webp|avif|gif|svg)$/i;
  return validImagePathPattern.test(trimmed) ? trimmed : null;
}

function canonicalizeCategory(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/* ── Expandable Summary ──────────────────────────────────────── */

const SUMMARY_CHAR_LIMIT = 180;

function ExpandableSummary({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > SUMMARY_CHAR_LIMIT;

  const displayText = !needsTruncation || expanded
    ? text
    : text.slice(0, SUMMARY_CHAR_LIMIT).trimEnd() + "…";

  return (
    <div className="mt-4">
      <p className="text-base leading-7 text-[color:var(--text-soft)] lg:text-lg lg:leading-8">
        {displayText}
      </p>
      {needsTruncation && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-300/80 transition-colors duration-200 hover:text-teal-200"
        >
          {expanded ? "Read less" : "Read more"}
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

export function ProjectsSection({ projects, activeSlug }: ProjectsSectionProps) {
  const normalizedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        category: Array.isArray(project.category)
          ? project.category
              .map((item) => canonicalizeCategory(item))
              .filter((item): item is string => item !== null)
          : [],
        thumbnail: sanitizeImageSrc(project.thumbnail)
      })),
    [projects]
  );
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    for (const project of normalizedProjects) {
      for (const category of project.category) {
        categorySet.add(category);
      }
    }
    return ["All", ...Array.from(categorySet)];
  }, [normalizedProjects]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [selectedModelSlug, setSelectedModelSlug] = useState<string | null>(null);
  const has3dExperience = (project: Pick<ProjectData, "model3d">) => Boolean(project.model3d?.glb);

  const INITIAL_PROJECT_COUNT = 4;

  const selectedModelProject = useMemo(
    () => projects.find((project) => project.slug === selectedModelSlug && has3dExperience(project)) ?? null,
    [projects, selectedModelSlug]
  );
  const filteredProjects = useMemo(
    () => normalizedProjects.filter((p) => activeCategory === "All" || p.category.includes(activeCategory)),
    [normalizedProjects, activeCategory]
  );

  const visibleProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, INITIAL_PROJECT_COUNT);
  const hasMoreProjects = filteredProjects.length > INITIAL_PROJECT_COUNT;

  const handleOpenModel = (slug: string) => {
    setSelectedModelSlug(slug);
    setModelModalOpen(true);
  };

  const handleCloseModal = () => {
    setModelModalOpen(false);
    setTimeout(() => setSelectedModelSlug(null), 300);
  };

  return (
    <section id="projects" className="section-bg">
      <SectionHeading
        eyebrow="Projects"
        title="Real-World Projects in AI, Embedded Systems, and Control"
        description="A collection of hands-on projects showcasing how I design, build, and debug intelligent systems — from embedded hardware to AI-driven applications and real-time control solutions."
      />

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:gap-3">
        {categories.map((category) => (
          <motion.button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              setShowAllProjects(false);
            }}
            aria-pressed={category === activeCategory}
            whileTap={{ scale: 0.95 }}
            className={`min-w-fit rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 lg:text-base ${
              category === activeCategory
                ? "border-teal-300/40 bg-teal-300/15 text-white"
                : "border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] text-[color:var(--text-soft)] hover:border-[color:var(--line-strong)] hover:text-white"
            } micro-press`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-10 grid gap-5 xl:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => {
            const isActive = activeSlug === project.slug;
            const thumbnailSrc = sanitizeImageSrc(project.thumbnail);

            return (
              <motion.article
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "border-teal-300/35 bg-teal-300/[0.08] shadow-[var(--shadow-sm)]"
                    : "border-[color:var(--line)] bg-[rgba(11,17,23,0.62)] hover:border-[color:var(--line-strong)] hover:shadow-[var(--shadow-sm)]"
                } interactive-card`}
              >
                <div className="flex flex-col gap-5 p-5 sm:p-6">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[color:var(--line)] bg-[rgba(11,17,23,0.7)]">
                    {thumbnailSrc ? (
                      <img
                        src={thumbnailSrc || undefined}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
                    {has3dExperience(project) ? (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/40 bg-slate-950/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                        <Layers3 className="h-3.5 w-3.5" />
                        3D Model
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200/90 lg:text-base">
                            {project.slug.replaceAll("-", " ")}
                          </p>
                          <h3 className="text-2xl font-bold text-white sm:text-3xl">
                            {project.title}
                          </h3>
                          <p className="text-base font-medium text-[color:var(--text)] lg:text-lg">
                            {project.tagline}
                          </p>
                        </div>
                        <Layers3 className="h-6 w-6 flex-shrink-0 text-teal-200/70" />
                      </div>

                      <ExpandableSummary text={project.summary} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="tag-chip"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      {has3dExperience(project) ? (
                        <button
                          type="button"
                          onClick={() => handleOpenModel(project.slug)}
                          className="button-secondary"
                          aria-label={`Open 3D model for ${project.title}`}
                        >
                          View 3D Model
                          <Layers3 className="h-4 w-4" />
                        </button>
                      ) : null}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="button-primary"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        View on GitHub
                        <Github className="h-4 w-4" />
                      </a>
                      <a
                        href="#contact"
                        className="button-secondary"
                        aria-label={`Start a project inquiry for ${project.title}`}
                      >
                        Discuss Similar Build
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Show More / Show Less toggle */}
      {hasMoreProjects && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={() => setShowAllProjects((prev) => !prev)}
            className="group flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] px-6 py-3 text-sm font-medium text-[color:var(--text-soft)] transition-all duration-300 hover:border-teal-300/40 hover:bg-teal-300/10 hover:text-white lg:text-base"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
          >
            {showAllProjects ? (
              <>
                Show Less
                <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </>
            ) : (
              <>
                Show All Projects ({filteredProjects.length})
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {selectedModelProject ? (
        <ModelViewerModal
          project={selectedModelProject}
          isOpen={modelModalOpen}
          onClose={handleCloseModal}
        />
      ) : null}

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
            className="mt-16 rounded-2xl border border-dashed border-[color:var(--line)] bg-[rgba(11,17,23,0.65)] p-8 text-center"
        >
          <p className="text-lg text-[color:var(--text-soft)]">No projects found in this category.</p>
        </motion.div>
      )}
    </section>
  );
}

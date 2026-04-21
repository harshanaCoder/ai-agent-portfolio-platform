"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { ProjectData } from "@/lib/mainData";

const ProjectSceneCanvas = dynamic(
  () => import("./project-scene-canvas").then((mod) => mod.ProjectSceneCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-950/70" />
  }
);

type ModelViewerModalProps = {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ModelViewerModal({ project, isOpen, onClose }: ModelViewerModalProps) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [project?.slug, isOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleClose = () => {
    setZoom(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative h-full w-full max-h-[90vh] max-w-6xl overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-2xl">
              {/* Header */}
              <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-100">{project.title}</h2>
                  <p className="text-xs text-slate-400">{project.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-white/10 bg-slate-800/50 p-2 transition hover:border-white/20 hover:bg-slate-700/50"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-slate-300" />
                </button>
              </div>

              {/* Canvas Container */}
              <div className="relative h-full w-full pt-20">
                <ProjectSceneCanvas
                  project={project}
                  zoomLevel={zoom}
                />
              </div>

              {/* Controls */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap items-center gap-3">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-slate-950/80 p-2 backdrop-blur">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="rounded-md border border-transparent bg-slate-800/50 p-2 transition hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4 text-slate-300" />
                  </button>

                  <div className="min-w-12 text-center text-xs font-medium text-cyan-100">
                    {Math.round(zoom * 100)}%
                  </div>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= 2}
                    className="rounded-md border border-transparent bg-slate-800/50 p-2 transition hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4 text-slate-300" />
                  </button>
                </div>

                {/* Info Text */}
                <div className="flex-1 text-xs text-slate-400">
                  Drag to rotate • Right-drag to move • Scroll or buttons to zoom
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-500/20"
                  aria-label="Back to projects"
                >
                  ← Back
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

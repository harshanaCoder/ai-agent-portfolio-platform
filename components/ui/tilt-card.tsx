"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees (default 12) */
  maxTilt?: number;
  /** Glow color on hover */
  glowColor?: string;
  /** Enable holographic sheen effect */
  holographic?: boolean;
};

/**
 * A card that physically tilts in 3D space following the cursor.
 * Uses CSS transforms (zero Three.js overhead) with a holographic
 * gradient overlay for a premium feel.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glowColor = "rgba(77, 233, 211, 0.15)",
  holographic = true
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    transition: "transform 0.1s ease-out"
  });
  const [sheenStyle, setSheenStyle] = useState({
    background: "transparent",
    opacity: 0
  });
  const [glowStyle, setGlowStyle] = useState({
    boxShadow: "none"
  });

  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      // Cancel previous frame to avoid stacking
      cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = cardRef.current!.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalized position from center (-1 to 1)
        const normalizedX = (e.clientX - centerX) / (rect.width / 2);
        const normalizedY = (e.clientY - centerY) / (rect.height / 2);

        const tiltX = -normalizedY * maxTilt;
        const tiltY = normalizedX * maxTilt;

        setTiltStyle({
          transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: "transform 0.1s ease-out"
        });

        // Holographic sheen follows cursor
        if (holographic) {
          const sheenX = ((e.clientX - rect.left) / rect.width) * 100;
          const sheenY = ((e.clientY - rect.top) / rect.height) * 100;

          setSheenStyle({
            background: `radial-gradient(
              600px circle at ${sheenX}% ${sheenY}%,
              rgba(77, 233, 211, 0.12),
              rgba(167, 139, 250, 0.06) 40%,
              rgba(255, 184, 106, 0.04) 60%,
              transparent 80%
            )`,
            opacity: 1
          });
        }

        // Dynamic glow shadow
        const glowX = normalizedX * 12;
        const glowY = normalizedY * 12;
        setGlowStyle({
          boxShadow: `${glowX}px ${glowY}px 30px -8px ${glowColor}, 0 0 20px -8px ${glowColor}`
        });
      });
    },
    [maxTilt, glowColor, holographic]
  );

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    setTiltStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
      transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
    });

    setSheenStyle({
      background: "transparent",
      opacity: 0
    });

    setGlowStyle({
      boxShadow: "none"
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      style={{
        ...tiltStyle,
        ...glowStyle,
        transformStyle: "preserve-3d",
        willChange: "transform"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Holographic sheen overlay */}
      {holographic && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{
            ...sheenStyle,
            transition: "opacity 0.4s ease-out",
            mixBlendMode: "screen"
          }}
        />
      )}

      {/* Edge highlight on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          border: "1px solid rgba(77, 233, 211, 0.15)",
          background: "linear-gradient(135deg, rgba(77, 233, 211, 0.05), transparent 50%, rgba(255, 184, 106, 0.03))"
        }}
      />
    </motion.div>
  );
}

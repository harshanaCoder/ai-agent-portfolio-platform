import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full space-y-3 lg:max-w-3xl"
      >
        <p className="eyebrow-label">
          {eyebrow}
        </p>
        <h2 className="text-balance max-w-[18ch] text-[clamp(2rem,5.4vw,4.2rem)] font-bold leading-[1.04] text-white">
          {title}
        </h2>
        <p className="text-base leading-7 text-[color:var(--text-soft)] sm:max-w-[60ch] lg:text-xl lg:leading-9">
          {description}
        </p>
      </motion.div>
      {action ? (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="shrink-0 pt-1 md:pt-0"
        >
          {action}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
import { motion } from "framer-motion";
import { skillCategories } from "@/lib/mainData";
import { SectionHeading } from "@/components/ui/section-heading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function SkillsSection() {
  return (
    <section id="skills" className="section-bg">
      <SectionHeading
        eyebrow="Skills"
        title="Software Engineering for Intelligent and Embedded Systems"
        description="Building scalable and reliable software that powers AI-driven applications, embedded devices, and real-time control systems."
      />

      <motion.div
        className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {skillCategories.map((category) => (
          <motion.div
            key={category.title}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.85 }}
            className="group glass-panel interactive-card rounded-2xl p-5 sm:p-6"
          >
            <div
              className={`inline-block rounded-full bg-gradient-to-r ${category.accent} px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:text-sm lg:text-base`}
            >
              {category.title}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {category.items.map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -1, scale: 1.03 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="rounded-lg border border-[color:var(--line)] bg-[rgba(11,17,23,0.7)] px-3 py-1.5 text-sm font-medium text-[color:var(--text)] transition-colors duration-200 group-hover:border-[color:var(--line-strong)] lg:text-base"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
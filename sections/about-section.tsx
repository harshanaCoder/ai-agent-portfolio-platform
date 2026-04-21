import { motion } from "framer-motion";
import Image from "next/image";
import { focusAreas } from "@/lib/mainData";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutSection() {
  return (
    <section id="about" className="section-bg">
      <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="h-full"
        >
          <div className="glass-panel interactive-card group flex h-full flex-col justify-between rounded-2xl p-5 sm:p-6">
            <div>
              <p className="eyebrow-label">Developer Profile</p>
              <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Software Engineering Student | Aspiring AI Engineer</h3>
              <p className="mt-3 text-base leading-7 text-[color:var(--text-soft)] lg:text-lg lg:leading-8">
                Passionate about building intelligent systems where software, electronics, and automation work seamlessly together.
              </p>
            </div>

            <div className="relative mt-8 rounded-2xl border border-[color:var(--line)] bg-[rgba(11,17,23,0.68)] p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(47,224,200,0.12),transparent_48%)]" />
              <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border-2 border-teal-300/30 transition-transform duration-500 ease-out group-hover:scale-[1.03] sm:h-56 sm:w-56">
                <Image
                  src="/profile_img.png"
                  alt="Janith Harshana - Software & AI Engineer"
                  fill
                  sizes="(max-width: 640px) 12rem, 14rem"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <SectionHeading
            eyebrow="Biography"
            title="Building intelligent applications, not just software."
            description="I am a Software Engineering student with a strong focus on Artificial Intelligence, robotics, and embedded systems. I specialize in building intelligent applications that interact with the real world, combining software development with sensor-driven systems and automation.

I enjoy transforming ideas into functional solutions by integrating software, electronics, and system-level thinking, creating practical and innovative systems that bridge the digital and physical worlds."
          />

          <div className="glass-panel interactive-card space-y-4 rounded-2xl p-5 sm:p-6">
            <p className="text-base leading-8 text-[color:var(--text-soft)] lg:text-lg lg:leading-9">
              Through hands-on experience, I have developed strong skills in programming, embedded development, and real-time data processing. I focus on building systems that are not only functional but also efficient, scalable, and reliable.
            </p>
            <p className="text-base leading-8 text-[color:var(--text-soft)] lg:text-lg lg:leading-9">
              What sets me apart is my ability to bridge software and hardware, delivering complete end-to-end solutions rather than isolated applications. I am constantly learning and exploring new developments in AI, automation, and emerging technologies.
            </p>
            <p className="pt-1 text-base font-semibold text-teal-200 lg:text-lg">
              My goal is to grow into an AI Engineer who builds intelligent, scalable systems that solve real-world problems.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  transition: { type: "spring", stiffness: 360, damping: 24, mass: 0.8 }
                }}
                whileTap={{ scale: 0.99 }}
                className="glass-panel interactive-card rounded-2xl p-4 sm:p-5"
              >
                <h4 className="text-lg font-bold text-white">
                  {area.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)] sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
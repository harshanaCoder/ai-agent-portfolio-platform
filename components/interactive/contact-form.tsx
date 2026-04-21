"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus("idle");

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };
      setStatus(response.ok ? "success" : "error");
      setMessage(data.message ?? (response.ok ? "Thank you! Message sent." : "Unable to send message."));
    } catch {
      setStatus("error");
      setMessage("The contact API is not reachable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="grid gap-2"
        >
          <label htmlFor="name" className="text-sm font-medium text-[color:var(--text)] lg:text-base">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="rounded-lg border border-[color:var(--line)] bg-[rgba(11,17,23,0.72)] px-4 py-3 text-base text-white outline-none transition-all duration-200 placeholder:text-[color:var(--text-muted)] hover:border-[color:var(--line-strong)] focus:border-teal-300/50 focus:ring-2 focus:ring-teal-300/25 lg:text-lg"
            placeholder="Janith"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          viewport={{ once: true }}
          className="grid gap-2"
        >
          <label htmlFor="email" className="text-sm font-medium text-[color:var(--text)] lg:text-base">
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-[color:var(--line)] bg-[rgba(11,17,23,0.72)] px-4 py-3 text-base text-white outline-none transition-all duration-200 placeholder:text-[color:var(--text-muted)] hover:border-[color:var(--line-strong)] focus:border-teal-300/50 focus:ring-2 focus:ring-teal-300/25 lg:text-lg"
            placeholder="you@example.com"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        viewport={{ once: true }}
        className="grid gap-2"
      >
        <label htmlFor="projectType" className="text-sm font-medium text-[color:var(--text)] lg:text-base">
          Project Type
        </label>
        <input
          id="projectType"
          name="projectType"
          className="rounded-lg border border-[color:var(--line)] bg-[rgba(11,17,23,0.72)] px-4 py-3 text-base text-white outline-none transition-all duration-200 placeholder:text-[color:var(--text-muted)] hover:border-[color:var(--line-strong)] focus:border-teal-300/50 focus:ring-2 focus:ring-teal-300/25 lg:text-lg"
          placeholder="e.g., AI assistant, IoT monitoring platform, robotics automation"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        viewport={{ once: true }}
        className="grid gap-2"
      >
        <label htmlFor="message" className="text-sm font-medium text-[color:var(--text)] lg:text-base">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="resize-none rounded-lg border border-[color:var(--line)] bg-[rgba(11,17,23,0.72)] px-4 py-3 text-base text-white outline-none transition-all duration-200 placeholder:text-[color:var(--text-muted)] hover:border-[color:var(--line-strong)] focus:border-teal-300/50 focus:ring-2 focus:ring-teal-300/25 lg:text-lg"
          placeholder="Tell me what you're building, the constraints, and what you need help shipping."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        viewport={{ once: true }}
        className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center"
      >
        <p
          className={`text-sm transition-colors duration-300 lg:text-base min-h-[1.5rem] ${
            status === "success"
              ? "font-medium text-emerald-300"
              : status === "error"
                ? "font-medium text-rose-300"
                : "text-[color:var(--text-soft)]"
          }`}
        >
          {message}
        </p>
        <motion.button
          type="submit"
          disabled={loading}
          className="button-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
          aria-busy={loading}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ y: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.8 }}
        >
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Send Message"}
        </motion.button>
      </motion.div>
    </form>
  );
}

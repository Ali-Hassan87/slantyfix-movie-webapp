"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ErrorState({ message, buttonLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-spotlight/40 bg-spotlight/6 rounded-md p-8 max-w-130"
    >
      <h2 className="font-display text-2xl text-spotlight tracking-wide mb-2">
        Something went wrong
      </h2>
      <p className="font-mono text-sm text-muted mb-6">{message}</p>
      <Button
        onClick={onAction}
        className="bg-marquee text-ink hover:bg-[#f4c357] font-mono text-xs uppercase tracking-wider"
      >
        {buttonLabel}
      </Button>
    </motion.div>
  );
}
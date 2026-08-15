"use client";
import { motion } from "framer-motion";

export default function ScreenshotCard({ src, alt, href }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="block rounded-md overflow-hidden border border-line hover:border-marquee/60 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] transition-colors"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.a>
  );
}
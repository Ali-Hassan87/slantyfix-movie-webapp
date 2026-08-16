"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import BorderGlow from "./ui/BorderGlow";
import ElectricBorder from "./ui/ElectricBorder";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sf_recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const saveSearch = useCallback((q) => {
    setRecentSearches(prev => {
      const updated = [q, ...prev.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 5);
      localStorage.setItem("sf_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const go = useCallback((q) => {
    const clean = q.trim();
    if (!clean) return;
    saveSearch(clean);
    onClose();
    router.push(`/search?q=${encodeURIComponent(clean)}`);
  }, [router, onClose, saveSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    go(query);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — halka blur, movie background clearly visible rahe */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-[#0a0914]/35 backdrop-blur-sm"
          />

          {/* Modal — pt reduced on mobile so it doesn't sit too low once
              the on-screen keyboard opens and eats vertical space */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-101 flex items-start justify-center pt-[8vh] sm:pt-[20vh] px-3 sm:px-4"
          >
            <ElectricBorder
            color="#DBE1E3"
            speed={0.2}
            chaos={0.1}
            thickness={2}
            style={{ borderRadius: 50 }}
            >
            <div
              className="search-modal-glass relative w-full max-w-2xl rounded-3xl sm:rounded-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main glass card — lighter, silvery surface. Capped height
                  + flex-col so only the middle (recent list) scrolls on
                  mobile, keeping input + footer always visible. */}
              <div className="relative flex flex-col max-h-[82vh] sm:max-h-none overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/[0.14] bg-white/6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)]">

                {/* Top sheen line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-white/6 rounded-full blur-3xl pointer-events-none" />

                {/* Close button — clearly visible glass pill */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/16 bg-white/8 text-white/70 backdrop-blur-xl shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-[#eab308]/40 hover:bg-[#eab308]/15 hover:text-[#eab308] hover:shadow-[0_0_24px_rgba(234,179,8,0.2)] active:scale-90"
                  aria-label="Close search"
                >
                  <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* Input Section — shrink-0 so it never gets squeezed by
                    the scrollable content below it */}
                <div className="shrink-0 p-5 pb-4 sm:p-8 sm:pb-6">
                  <form onSubmit={handleSubmit}>
                    <div className="group relative flex items-center gap-3 sm:gap-4 rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500 focus-within:border-[#eab308]/35 focus-within:bg-white/10 focus-within:shadow-[0_0_40px_-10px_rgba(234,179,8,0.18),inset_0_1px_0_rgba(255,255,255,0.16)]">

                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white/45 shrink-0 transition-colors duration-300 group-focus-within:text-[#eab308]/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>

                      <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search movies, series..."
                        className="flex-1 border-2 bg-transparent text-base sm:text-lg text-white/95 placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 font-light tracking-wide"
                      />

                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="flex h-5.5 w-5.5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/10 text-white/45 hover:bg-white/18 hover:text-white/80 transition-all duration-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Content — the part that scrolls on mobile when the
                    recent-searches list is longer than the modal's
                    capped height */}
                <div className="px-3 pb-3 overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 mb-1">
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      {recentSearches.length > 0 ? "Recent Searches" : "Suggestions"}
                    </span>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem("sf_recent_searches");
                        }}
                        className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-white/35 hover:text-[#eab308] transition-colors duration-300"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Recent List */}
                  {recentSearches.length > 0 ? (
                    <div className="space-y-1 px-1 sm:px-2 pb-4">
                      {recentSearches.map((q, i) => (
                        <motion.button
                          key={q}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                          onClick={() => go(q)}
                          className="group w-full flex items-center gap-3 sm:gap-4 rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 text-left transition-all duration-300 hover:bg-white/6"
                        >
                          {/* Clock icon in glass orb */}
                          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:border-[#eab308]/30 group-hover:text-[#eab308]/70 group-hover:bg-[#eab308]/10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>

                          <span className="flex-1 truncate text-sm sm:text-[15px] text-white/60 font-light transition-colors duration-300 group-hover:text-white/95">
                            {q}
                          </span>

                          <svg
                            className="w-4 h-4 text-white/25 transition-all duration-300 group-hover:text-[#eab308]/60 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="py-8 sm:py-12 flex flex-col items-center gap-4 sm:gap-5"
                    >
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.2)]">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white/25" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-white/30 font-light tracking-wide">Type to discover movies</p>
                    </motion.div>
                  )}
                </div>

                {/* Footer — the keyboard-shortcut hints ("enter"/"esc")
                    are meaningless on a touchscreen, so they're hidden
                    below sm: and the Search button goes full-width on
                    mobile instead. shrink-0 keeps it pinned even while
                    the content above scrolls. */}
                <div className="shrink-0 border-t border-white/8 bg-white/3 px-5 py-4 sm:px-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="hidden sm:flex items-center gap-5 text-[10px] text-white/30 font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <kbd className="px-2 py-1 rounded-lg bg-white/8 border border-white/[0.14] text-[9px] text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">enter</kbd>
                      Search
                    </span>
                    <span className="flex items-center gap-2">
                      <kbd className="px-2 py-1 rounded-lg bg-white/8 border border-white/[0.14] text-[9px] text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">esc</kbd>
                      Close
                    </span>
                  </div>

                  {query.trim() && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full sm:w-auto rounded-full bg-linear-to-r from-[#eab308] to-[#f59e0b] px-6 py-2.5 sm:py-2 text-xs font-semibold uppercase tracking-wider text-[#1a1825] shadow-[0_4px_20px_rgba(234,179,8,0.3)] transition-all duration-300 hover:shadow-[0_4px_28px_rgba(234,179,8,0.45)] hover:scale-105 active:scale-95"
                    >
                      Search
                    </button>
                  )}
                </div>
              </div>
            </div>
            </ElectricBorder>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
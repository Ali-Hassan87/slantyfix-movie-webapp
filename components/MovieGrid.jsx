"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BorderGlow from "./ui/BorderGlow";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

function isNewRelease(releaseDate) {
  if (!releaseDate) return false;
  const days = (Date.now() - new Date(releaseDate).getTime()) / 86400000;
  return days >= 0 && days <= 30;
}

export default function MovieGrid({ movies, onToggleWatchlist, watchlistIds = [] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5"
    >
      {movies.map((m, index) => {
        const isSaved = watchlistIds.includes(m.id);
        const fresh = isNewRelease(m.release_date);
        const primaryGenre = m.genre_ids?.length ? GENRE_MAP[m.genre_ids[0]] : null;

        return (
          <motion.div
            key={m.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col"
          >
            <BorderGlow
              alwaysOn
              borderRadius={16}
              borderWidth={1.8}
              glowRadius={30}
              glowIntensity={1.35}
              spinDuration={3}
              colors={["#FFB000", "#F97316", "#F97316", "#FFB000"]}
              backgroundColor="#0D0B10"
              fillOpacity={0.025}
            >
              {/* Card */}
              <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[#131218] ring-1 ring-white/6 shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/40 group-hover:ring-white/10">

                {/* Poster */}
                <Link href={`/movie/${m.id}`} className="relative block aspect-2/3 overflow-hidden bg-[#1a1920]">
                  {m.poster_path ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}${m.poster_path}`}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      priority={index < 6}
                      loading={index < 6 ? "eager" : "lazy"}
                      quality={[75, 80]}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                      <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient overlay for text readability */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Top-right: Rating */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="flex items-center gap-1 rounded-lg bg-black/50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-400 ring-1 ring-white/10 backdrop-blur-md">
                      <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {m.vote_average?.toFixed(1) ?? "—"}
                    </span>
                  </div>

                  {/* Top-left: New indicator */}
                  {fresh && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20">
                        <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                        New
                      </span>
                    </div>
                  )}

                  {/* Watchlist button — appears on hover (desktop), always visible (mobile) */}
                  {onToggleWatchlist && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleWatchlist(m.id);
                      }}
                      aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
                      className={`card-watchlist-btn${isSaved ? " is-saved" : ""}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill={isSaved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                        />
                      </svg>
                    </button>
                  )}
                </Link>

                {/* Info */}
                <Link href={`/movie/${m.id}`} className="flex flex-col p-3">
                  <h3 className="text-sm font-semibold leading-snug text-white/90 line-clamp-2 transition-colors group-hover:text-white">
                    {m.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-white/40">
                    <span className="font-medium tabular-nums">
                      {m.release_date ? new Date(m.release_date).getFullYear() : "—"}
                    </span>
                    {primaryGenre && (
                      <>
                        <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
                        <span className="truncate">{primaryGenre}</span>
                      </>
                    )}
                  </div>
                </Link>
              </div>
            </BorderGlow>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
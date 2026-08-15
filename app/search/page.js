"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import MovieGrid from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import MovieHero from "@/components/MovieHero";
import Link from "next/link";

function Results() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setSearched(true);

    fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setResults(data.results || []);
      })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [query]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-[#131218] ring-1 ring-white/6">
              <Skeleton className="aspect-2/3 w-full bg-[#1a1920]" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-4/5 bg-[#1a1920]" />
                <Skeleton className="h-3 w-1/3 bg-[#1a1920]" />
              </div>
            </div>
          ))}
        </motion.div>
      ) : searched && results.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <p className="font-mono text-muted text-sm">
            No results found for &quot;{query}&quot;.
          </p>
        </motion.div>
      ) : results.length > 0 ? (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
          <MovieGrid movies={results} />
        </motion.div>
      ) : (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <p className="font-mono text-muted text-sm">Use the search bar to find movies</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SearchPage() {
  return (
    <MovieHero>
      <Button
          asChild
          variant="outline"
          className="border-line text-muted hover:text-marquee hover:border-marquee bg-transparent font-mono text-xs uppercase tracking-wider mb-6"
        >
          <Link href="/">← Back</Link>
        </Button>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="font-display text-3xl sm:text-4xl text-paper mb-8">Search</h1>
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-[#131218] ring-1 ring-white/6">
              <Skeleton className="aspect-2/3 w-full bg-[#1a1920]" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-4/5 bg-[#1a1920]" />
                <Skeleton className="h-3 w-1/3 bg-[#1a1920]" />
              </div>
            </div>
          ))}
        </div>
      }>
        <Results />
      </Suspense>
    </div>
    </MovieHero>
  );
}
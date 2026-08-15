"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MovieGrid from "@/components/MovieGrid";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function WatchlistPage() {
  const { watchlistIds, toggleWatchlist, loaded } = useWatchlist();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loaded) return;

    if (watchlistIds.length === 0) {
      setMovies([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(
      watchlistIds.map((id) =>
        fetch(`/api/movies/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setMovies(results.filter(Boolean));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [watchlistIds, loaded]);

  return (
    <div>
      <Button
        asChild
        variant="outline"
        className="border-line text-muted hover:text-marquee hover:border-marquee bg-transparent font-mono text-xs uppercase tracking-wider mb-6"
      >
        <Link href="/">← Back</Link>
      </Button>

      <h1>My Watchlist</h1>

      {!loaded || loading ? (
        <p className="font-mono text-muted text-sm mt-4">Loading your watchlist...</p>
      ) : movies.length === 0 ? (
        <p className="font-mono text-muted text-sm mt-4">
          Your watchlist is empty. Tap the heart on any movie to save it here.
        </p>
      ) : (
        <MovieGrid
          movies={movies}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      )}
    </div>
  );
}
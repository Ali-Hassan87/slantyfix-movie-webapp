"use client";

import { useState, useCallback } from "react";
import MovieGrid from "./MovieGrid";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function LatestMoviesSection({ initialMovies, initialPage, totalPages }) {
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const { watchlistIds, toggleWatchlist } = useWatchlist();

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/movies/latest?page=${nextPage}`);
      const data = await res.json();
      setMovies((prev) => [...prev, ...(data.results || [])]);
      setPage(nextPage);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, page, totalPages]);

  return (
    <div>
      <h1>Latest Movies</h1>
      <MovieGrid
        movies={movies}
        watchlistIds={watchlistIds}
        onToggleWatchlist={toggleWatchlist}
      />

      {page < totalPages && (
        <div className="flex justify-center mt-8">
          <button onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
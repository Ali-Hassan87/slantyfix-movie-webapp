"use client";

import MovieGrid from "@/components/MovieGrid";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function MovieGridClient({ movies }) {
  const { watchlistIds, toggleWatchlist } = useWatchlist();

  return (
    <MovieGrid
      movies={movies}
      watchlistIds={watchlistIds}
      onToggleWatchlist={toggleWatchlist}
    />
  );
}
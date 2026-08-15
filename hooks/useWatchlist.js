"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "slantyfix_watchlist";

export function useWatchlist() {
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage once, on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setWatchlistIds(stored ? JSON.parse(stored) : []);
    } catch {
      setWatchlistIds([]);
    }
    setLoaded(true);
  }, []);

  // Persist whenever it changes (skip the very first render before load)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistIds));
  }, [watchlistIds, loaded]);

  const toggleWatchlist = useCallback((movieId) => {
    setWatchlistIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlistIds.includes(movieId),
    [watchlistIds]
  );

  return { watchlistIds, toggleWatchlist, isInWatchlist, loaded };
}
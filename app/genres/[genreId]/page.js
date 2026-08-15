import Link from "next/link";
import { Button } from "@/components/ui/button";
import MovieGridClient from "@/components/MovieGridClient";

async function getGenreMovies(genreId) {
  const res = await fetch(`http://localhost:3000/api/movies/genre/${genreId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("This genre Id currently not in found");
  }
  return res.json();
}

export default async function GenreMoviesPage({ params }) {
  const { genreId } = await params;
  const data = await getGenreMovies(genreId);
  const movies = data.results || [];

  return (
    <div>
      <Button
        asChild
        variant="outline"
        className="border-line text-muted hover:text-marquee hover:border-marquee bg-transparent font-mono text-xs uppercase tracking-wider mb-6"
      >
        <Link href="/genres">← Back to Genres</Link>
      </Button>

      <h1>Movies</h1>

      {movies.length === 0 ? (
        <p className="font-mono text-muted text-sm mt-4">
          This genre Id currently not found.
        </p>
      ) : (
        <MovieGridClient movies={movies} />
      )}
    </div>
  );
}
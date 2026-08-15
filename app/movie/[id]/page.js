import Link from "next/link";
import Image from "next/image";
import ScreenshotCard from "@/components/ScreenshotCard";
import MovieHero from "@/components/MovieHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ElectricBorder from "@/components/ui/ElectricBorder";

async function getMovie(id) {
  const res = await fetch(`http://localhost:3000/api/movies/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Movie not found");
  }

  return res.json();
}

export default async function MoviePage({ params }) {
  const { id } = await params;
  const movie = await getMovie(id);
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const screenshots = movie.images?.backdrops?.slice(0, 8) || [];

  return (
    <MovieHero>
      <div>
        <Button
          asChild
          variant="outline"
          className="border-line text-muted hover:text-marquee hover:border-marquee bg-transparent font-mono text-xs uppercase tracking-wider mb-6"
        >
          <Link href="/">← Back</Link>
        </Button>
        <h1>{movie.title}</h1>

        {movie.poster_path && (
          <div className="relative w-full max-w-70 aspect-2/3 mb-6">
            <ElectricBorder
              color="#ea9208"
              speed={0.4}
              chaos={0.18}
              thickness={3}
              style={{ borderRadius: 16 }}
            >
              <div className="relative w-full aspect-2/3 rounded-md overflow-hidden border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="280px"
                  priority
                  className="object-cover opacity-0.8"
                />
              </div>
            </ElectricBorder>
          </div>
        )}
        <h3>Info</h3>
        <p>{movie.overview}</p>
        <Badge className="bg-marquee text-ink font-mono hover:bg-[#f4c357]">
          ★ {movie.vote_average?.toFixed(1)}
        </Badge>
        <p><strong>Release:</strong> {movie.release_date}</p>

        <ul>
          {movie.credits?.cast?.length > 0 && (
            <section className="mt-8">
              <h3>Cast</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 mt-3">
                {movie.credits.cast.slice(0, 6).map((actor) => (
                  <div
                    key={actor.id}
                    className="bg-surface border border-line rounded-md px-4 py-3"
                  >
                    <p className="font-body text-sm text-paper font-medium">{actor.name}</p>
                    <p className="font-mono text-xs text-muted mt-0.5">as {actor.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </ul>
        {trailer && (
          <section>
            <h3>Trailer</h3>
            <div className="trailer-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allowFullScreen
              />
            </div>
          </section>
        )}
        {screenshots.length > 0 && (
          <section>
            <h3>Screenshots</h3>
            <div className="screenshot-grid">
              {screenshots.map((s) => (
                <ScreenshotCard
                  key={s.file_path}
                  src={`https://image.tmdb.org/t/p/w500${s.file_path}`}
                  alt={`${movie.title} screenshot`}
                  href={`https://image.tmdb.org/t/p/original${s.file_path}`}
                />
              ))}
            </div>
          </section>
        )}

      </div >

    </MovieHero>
  );
}
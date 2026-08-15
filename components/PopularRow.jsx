import Link from "next/link";
import Image from "next/image";

export default function PopularRow({ movies = [] }) {
  if (movies.length === 0) return null;

  return (
    <div className="mt-16">
      <h3>Popular</h3>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
        {movies.slice(0, 10).map((m) => (
          <Link
            key={m.id}
            href={`/movie/${m.id}`}
            className="shrink-0 w-30 block"
          >
            <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-surface2 border border-line">
              {m.poster_path ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}${m.poster_path}`}
                  alt={m.title}
                  fill
                  sizes="120px"
                  quality={[65, 70]}
                  loading="eager"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-[10px] p-1 text-center">
                  {m.title}
                </div>
              )}
              <div className="absolute top-1.5 right-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                ★ {m.vote_average?.toFixed(1) ?? "—"}
              </div>
            </div>
            <p className="text-[11px] text-paper font-medium mt-1.5 line-clamp-1">
              {m.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
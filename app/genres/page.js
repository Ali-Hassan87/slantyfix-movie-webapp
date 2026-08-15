import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getGenres() {
  const res = await fetch("http://localhost:3000/api/genres", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load genres");
  return res.json();
}

export default async function GenresPage() {
  const data = await getGenres();
  const genres = data.genres || [];

  return (
    <div>
      <Button
        asChild
        variant="outline"
        className="border-line text-muted hover:text-marquee hover:border-marquee bg-transparent font-mono text-xs uppercase tracking-wider mb-6"
      >
        <Link href="/">← Back</Link>
      </Button>
      <h1>Genres</h1>
      <ul className="flex flex-wrap gap-3 mt-6 list-none p-0">
        {genres.map((genre) => (
          <li key={genre.id}>
            <Link
              href={`/genres/${genre.id}`}
              className="block bg-surface border border-line text-paper px-5 py-2.5 rounded-full text-sm no-underline hover:border-marquee hover:text-marquee transition-colors"
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
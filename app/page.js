import RotatingCards from "@/components/ui/RotatingCards";
import LatestMoviesSection from "@/components/LatestMoviesSection";
import PopularRow from "@/components/PopularRow";
// import ElectricBorder from "@/components/ui/ElectricBorder";
import { getBaseUrl } from "@/lib/utils";

async function getTrendingMovies() {
  const res = await fetch(`${getBaseUrl()}/api/movies/trending`, {
    cache: "no-store",
  });
  return res.json();
}

async function getLatestMovies() {
  const res = await fetch(`${getBaseUrl()}/api/movies/latest?page=1`, {
    cache: "no-store",
  });
  return res.json();
}

async function getPopularMovies() {
  const res = await fetch(`${getBaseUrl()}/api/movies/popular`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function HomePage() {
  const [trendingData, latestData, popularData] = await Promise.all([
    getTrendingMovies(),
    getLatestMovies(),
    getPopularMovies(),
  ]);

  const trending = (trendingData.results || []).slice(0, 10);
  const latest = latestData.results || [];
  const totalPages = Math.min(latestData.total_pages || 1, 500); // TMDB hard cap 500 pages
  const popular = popularData.results || [];

  return (
    <div>
      {/* overflow-x-hidden here because RotatingCards uses a 3D
          perspective + rotateY ring — on narrow mobile viewports the
          off-screen cards in that ring can push past the edge and
          trigger a horizontal scrollbar on the whole page. Everything
          else in this file is just data-fetching/orchestration, so
          there's nothing else here to make "more responsive" — the
          actual mobile layout lives inside LatestMoviesSection and
          PopularRow, which weren't shared. */}
      <div className="overflow-x-hidden">
        <RotatingCards movies={trending} />
      </div>

      <LatestMoviesSection
        initialMovies={latest}
        initialPage={1}
        totalPages={totalPages}
      />

      <PopularRow movies={popular} />
    </div>
  );
}
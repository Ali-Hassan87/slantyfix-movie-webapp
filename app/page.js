import RotatingCards from "@/components/ui/RotatingCards";
import LatestMoviesSection from "@/components/LatestMoviesSection";
import PopularRow from "@/components/PopularRow";
// import ElectricBorder from "@/components/ui/ElectricBorder";

async function getTrendingMovies() {
  const res = await fetch("http://localhost:3000/api/movies/trending", {
    cache: "no-store",
  });
  return res.json();
}

async function getLatestMovies() {
  const res = await fetch("http://localhost:3000/api/movies/latest?page=1", {
    cache: "no-store",
  });
  return res.json();
}

async function getPopularMovies() {
  const res = await fetch("http://localhost:3000/api/movies/popular", {
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
      <RotatingCards movies={trending} />

      <LatestMoviesSection
        initialMovies={latest}
        initialPage={1}
        totalPages={totalPages}
      />

      <PopularRow movies={popular} />
    </div>
  );
}
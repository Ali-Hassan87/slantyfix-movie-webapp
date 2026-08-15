import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request, { params }) {
  const { genreId } = await params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;

  try {
    const data = await fetchFromTMDB("/discover/movie", {
      with_genres: genreId,
      page,
    });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
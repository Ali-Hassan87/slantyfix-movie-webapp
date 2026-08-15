import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ error: "Query required" }, { status: 400 });
  }

  try {
    const data = await fetchFromTMDB("/search/movie", { query });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
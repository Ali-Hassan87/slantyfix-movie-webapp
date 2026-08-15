import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;

  try {
    const data = await fetchFromTMDB("/movie/popular", { page });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
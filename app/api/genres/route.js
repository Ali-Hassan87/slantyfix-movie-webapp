import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await fetchFromTMDB("/genre/movie/list");
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
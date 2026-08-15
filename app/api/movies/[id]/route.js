import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const data = await fetchFromTMDB(`/movie/${id}`, {
      append_to_response: "credits,videos,images",
      include_image_language: "en,null",
    });

    return Response.json(data);
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
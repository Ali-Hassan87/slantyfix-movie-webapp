import { NextResponse } from "next/server";
import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  try {
    const data = await fetchFromTMDB("/discover/movie", {
      sort_by: "primary_release_date.desc",
      "vote_count.gte": 1, // completely unreleased/empty entries avoid karne ke liye
      page,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch latest movies" },
      { status: 500 }
    );
  }
}
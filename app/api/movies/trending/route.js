import { NextResponse } from "next/server";
import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await fetchFromTMDB("/trending/movie/week");
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch trending movies" },
      { status: 500 }
    );
  }
}
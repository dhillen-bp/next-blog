import Article from "@/models/Article";
import { dbConnect } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slugToExclude = url.searchParams.get("exclude");

    await dbConnect();
    const recentArticles = await Article.find(
      slugToExclude ? { slug: { $ne: slugToExclude } } : {}
    )
      .sort({ createdAt: -1 }) // Sort by creation date
      .limit(5); // Limit to 5 recent articles

    return NextResponse.json(recentArticles);
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch recent articles" },
      { status: 500 }
    );
  }
}

import Article from "@/models/Article";
import { dbConnect } from "@/utils/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slugToExclude = url.searchParams.get("exclude");
    const limit = parseInt(url.searchParams.get("limit") || "3", 10); // Default to 3
    console.log(mongoose.models); // Log semua model yang terdaftar

    await dbConnect();
    const recentArticles = await Article.find(
      slugToExclude ? { slug: { $ne: slugToExclude } } : {}
    )
      .populate("category", "name slug icon")
      .populate("author", "name")
      .sort({ createdAt: -1 }) // Sort by creation date
      .limit(limit); // Limit the number of articles

    return NextResponse.json(recentArticles);
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch recent articles" },
      { status: 500 }
    );
  }
}

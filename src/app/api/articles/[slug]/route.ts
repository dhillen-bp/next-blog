import Article from "@/models/Article";
import { dbConnect } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    // Cari artikel berdasarkan slug
    const article = await Article.findOne({ slug: params.slug });
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { message: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

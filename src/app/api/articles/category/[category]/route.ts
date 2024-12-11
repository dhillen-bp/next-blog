import Article from "@/models/Article";
import Category from "@/models/Category";
import { dbConnect } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    await dbConnect();

    const category = await Category.findOne({ slug: params.category });
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const articles = await Article.find({
      category: category._id, // Gunakan ID dari kategori
    }).populate("category");

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

import Article from "@/models/Article";
import Category from "@/models/Category";
import { dbConnect } from "@/utils/db";
import { getTokenFromCookie, verifyToken } from "@/utils/jwt_helper";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const token = getTokenFromCookie(req);
    if (!token) {
      return NextResponse.json(
        { message: "Token not found. Please login." },
        { status: 401 } // Unauthorized jika tidak ada token
      );
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 } // Unauthorized jika token tidak valid atau kadaluarsa
      );
    }

    // Ambil data total categories
    const totalCategories = await Category.countDocuments();

    // Ambil data total articles
    const totalArticles = await Article.countDocuments();

    // Ambil artikel populer
    const totalMyArticles = await Article.find({
      author: decodedToken.id,
    }).countDocuments();

    const response = {
      totalCategories,
      totalArticles,
      totalMyArticles,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

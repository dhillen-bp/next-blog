import Article from "@/models/Article";
import { dbConnect } from "@/utils/db";
import { getTokenFromCookie, verifyToken } from "@/utils/jwt_helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = getTokenFromCookie(req);

    if (!token) {
      return NextResponse.json(
        { message: "Token not found. Please login." },
        { status: 401 } // Unauthorized jika tidak ada token
      );
    }

    // Verifikasi token dan ambil userId
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 } // Unauthorized jika token tidak valid atau kadaluarsa
      );
    }
    const authorId = decodedToken.id;

    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    // Jika ada query search, tambahkan filter pada pencarian
    const query = {
      author: authorId,
      ...(search && { title: { $regex: search, $options: "i" } }),
    };

    const articles = await Article.find(query)
      .populate("category", "name")
      .populate("author");
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

import Article from "@/models/Article";
import { dbConnect } from "@/utils/db";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fsPromises } from "fs";
import { v4 as uuidv4 } from "uuid";
import { getTokenFromCookie, verifyToken } from "@/utils/jwt_helper";

export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find()
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

export async function POST(req: Request) {
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

    // Menangani form data
    const formData = await req.formData();

    // Ambil data dari form
    const title = formData.get("title") as string;
    const content = formData.get("content");
    const category = formData.get("category"); // Bisa berbentuk array
    const file = formData.get("thumbnail");
    const authorId = [String(decodedToken.id)]; // Ambil userId dari decoded token
    console.log("authorId: ", authorId);

    // Validasi input
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Thumbnail is required and must be a valid file" },
        { status: 400 }
      );
    }

    // Membaca file thumbnail sebagai buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Menghasilkan nama file unik dengan UUID
    const fileExtension = path.extname(file.name); // Mendapatkan ekstensi file
    const filename = uuidv4() + fileExtension; // Menambahkan UUID untuk nama file unik

    // Menentukan path tempat menyimpan file
    const filePath = path.join(process.cwd(), "public/articles", filename);

    // Menyimpan file ke dalam folder public/articles
    await fsPromises.writeFile(filePath, buffer);

    // Menyimpan artikel baru ke database
    const newArticle = new Article({
      title: title,
      content: content as string,
      thumbnail: path.join("articles", filename), // Menyimpan path relatif thumbnail
      category,
      author: decodedToken.id,
    });

    console.log("new article: ", newArticle);

    await newArticle.save();

    return NextResponse.json(newArticle, { status: 201 }); // Created status jika data berhasil dibuat
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { message: "Failed to create article" },
      { status: 500 } // Internal error jika terjadi kesalahan saat penyimpanan
    );
  }
}

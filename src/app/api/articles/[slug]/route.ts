import Article from "@/models/Article";
import { dbConnect } from "@/utils/db";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fsPromises } from "fs";
import { v4 as uuidv4 } from "uuid";
import slugGenerator from "slug";
import { authenticateUser } from "@/utils/jwt_helper";

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

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content");
    const categories = [formData.get("categories")].filter(Boolean); // Bisa berbentuk array
    const file = formData.get("thumbnail");

    const article = await Article.findOne({ slug });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    let newThumbnailPath = article.thumbnail; // Default: gunakan ikon lama
    if (file && file instanceof File) {
      // Membaca file thumbnail sebagai buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Menghasilkan nama file unik dengan UUID
      const fileExtension = path.extname(file.name); // Mendapatkan ekstensi file
      const filename = uuidv4() + fileExtension; // Menambahkan UUID untuk nama file unik

      // Menentukan path tempat menyimpan file
      const filePath = path.join(process.cwd(), "public/articles", filename);

      // Menyimpan file ke dalam folder public/articles
      await fsPromises.writeFile(filePath, buffer);

      // Set path relatif thumbnail baru
      newThumbnailPath = path.join("articles", filename);

      // Hapus thumbnail lama jika ada (opsional)
      if (article.thumbnail && article.thumbnail.startsWith("icons")) {
        const oldIconPath = path.join(
          process.cwd(),
          "public",
          article.thumbnail
        );
        await fsPromises.unlink(oldIconPath).catch(() => {
          console.warn("Failed to delete old article file:", oldIconPath);
        });
      }
    }

    article.title = title as string;
    article.thumbnail = newThumbnailPath;
    article.content = content;
    article.categories = categories;
    article.slug = slugGenerator(title as string);

    await article.save();

    return NextResponse.json(article, { status: 200 }); // Success response
  } catch (error) {
    return NextResponse.json({ message: "Error: ", error }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { message: "Article ID is required" },
        { status: 400 }
      );
    }

    const authResult = await authenticateUser(req);

    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const article = await Article.findOne({ slug });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // Hapus file ikon jika ada
    if (article.thumbnail && article.thumbnail.startsWith("articles")) {
      const iconPath = path.join(process.cwd(), "public", article.thumbnail);
      await fsPromises.unlink(iconPath).catch(() => {
        console.warn("Failed to delete old thumbnail file:", iconPath);
      });
    }

    await article.deleteOne({ slug });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ message: "Error: ", error }, { status: 500 });
  }
}

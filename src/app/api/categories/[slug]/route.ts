import Category from "@/models/Category";
import { dbConnect } from "@/utils/db";
import path from "path";
import { promises as fsPromises } from "fs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import slugGenerator from "slug";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const category = await Category.findOne({ slug: params.slug });
    if (!category) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    // Ambil slug dari parameter
    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    // Menangani form data
    const formData = await req.formData();
    const name = formData.get("name");
    const file = formData.get("icon");

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await Category.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Jika ada file ikon baru, simpan ke server
    let newIconPath = category.icon; // Default: gunakan ikon lama
    if (file && file instanceof File) {
      // Membaca file icon sebagai buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Menghasilkan nama file unik dengan UUID
      const fileExtension = path.extname(file.name); // Mendapatkan ekstensi file
      const filename = uuidv4() + fileExtension; // Menambahkan UUID untuk nama file unik

      // Menentukan path tempat menyimpan file
      const filePath = path.join(process.cwd(), "public/icons", filename);

      // Menyimpan file ke dalam folder public/icons
      await fsPromises.writeFile(filePath, buffer);

      // Set path relatif ikon baru
      newIconPath = path.join("icons", filename);

      // Hapus ikon lama jika ada (opsional)
      if (category.icon && category.icon.startsWith("icons")) {
        const oldIconPath = path.join(process.cwd(), "public", category.icon);
        await fsPromises.unlink(oldIconPath).catch(() => {
          console.warn("Failed to delete old icon file:", oldIconPath);
        });
      }
    }

    // Perbarui kategori di database
    category.name = name as string;
    category.icon = newIconPath;
    category.slug = slugGenerator(name as string);

    await category.save();

    return NextResponse.json(category, { status: 200 }); // Success response
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: { slug: string } }) {
  try {
    await dbConnect();

    const { slug } = params;

    const category = await Category.findOne({ slug });
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}

import Category from "@/models/Category";
import { dbConnect } from "@/utils/db";
import path from "path";
import { promises as fsPromises } from "fs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Menangani form data
    const formData = await req.formData();

    // Validasi bahwa nama kategori dan file ikon ada
    const name = formData.get("name");
    const file = formData.get("icon");

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Icon is required and must be a valid file" },
        { status: 400 }
      );
    }

    // Membaca file icon sebagai buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Menghasilkan nama file unik dengan UUID
    const fileExtension = path.extname(file.name); // Mendapatkan ekstensi file
    const filename = uuidv4() + fileExtension; // Menambahkan UUID untuk nama file unik

    // Menentukan path tempat menyimpan file
    const filePath = path.join(process.cwd(), "public/icons", filename);

    // Menyimpan file ke dalam folder public/icons
    await fsPromises.writeFile(filePath, buffer);

    // Menyimpan kategori baru ke database dengan path ikon
    const newCategory = new Category({
      name: name as string,
      icon: path.join("icons", filename), // Menyimpan path relatif ikon
    });

    await newCategory.save();

    return NextResponse.json(newCategory, { status: 201 }); // Created status jika data berhasil dibuat
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 } // Internal error jika terjadi kesalahan saat penyimpanan
    );
  }
}

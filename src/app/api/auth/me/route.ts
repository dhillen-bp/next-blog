import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Ambil token dari cookie

  if (!token) {
    // Kirimkan response dengan data null jika token tidak ada
    return NextResponse.json({
      user: {
        email: null,
        name: null,
      },
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY!); // Validasi token
    return NextResponse.json(user); // Kirimkan data pengguna
  } catch (err) {
    // Jika token tidak valid atau ada masalah lain
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

import User from "@/models/User";
import { dbConnect } from "@/utils/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt-ts";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Periksa apakah email terdaftar
    const user = await User.findOne({ email });
    if (!user) {
      // Kembalikan error 401 jika email tidak ditemukan
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    // Periksa password
    const isPasswordValid = await compareSync(password, user.password);
    if (!isPasswordValid) {
      // Kembalikan error 401 jika password salah
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Buat response dengan token
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set cookie HttpOnly untuk token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya secure di production
      sameSite: "strict", // Untuk menghindari CSRF
      maxAge: 3600, // 1 jam
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

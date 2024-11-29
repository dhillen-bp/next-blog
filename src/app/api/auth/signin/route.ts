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
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    // Periksa password
    const isPasswordValid = await compareSync(password, user.password);
    if (!isPasswordValid) {
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

    // Buat respon dengan cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // Set cookie HttpOnly
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya gunakan secure di production
      sameSite: "strict", // Menghindari CSRF
      maxAge: 3600, // 1 jam
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Error: ", error }, { status: 500 });
  }
}

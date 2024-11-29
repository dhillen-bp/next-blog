import { NextResponse } from "next/server";
import Cookies from "js-cookie";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Sign out successful" });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Hapus cookie
    });
    Cookies.remove("token");

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Error: ", error }, { status: 500 });
  }
}

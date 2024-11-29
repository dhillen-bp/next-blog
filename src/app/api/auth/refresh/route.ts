import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface TokenPayload {
  _id: string;
  name: string;
}

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value; // Ambil refresh token dari cookie

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validasi refresh token
    const user = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as TokenPayload;

    // Buat access token baru
    const accessToken = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" } // Access token valid selama 15 menit
    );

    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ message: "Error: ", error }, { status: 401 });
  }
}

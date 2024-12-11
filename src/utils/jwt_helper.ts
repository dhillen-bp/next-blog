import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

// Fungsi untuk mendekode dan memverifikasi JWT
export function verifyToken(token: string): { id: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded; // Kembalikan decoded token (termasuk userId)
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null; // Jika token tidak valid atau kadaluarsa
  }
}

// Fungsi untuk mengambil token dari cookie
export function getTokenFromCookie(req: any): string | null {
  const token = req.cookies.get("token")?.value;

  return token || null; // Jika token tidak ada, kembalikan null
}

export async function authenticateUser(req: Request | NextRequest) {
  const token = getTokenFromCookie(req);

  if (!token) {
    return { error: "Token not found. Please login.", status: 401 };
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return { error: "Invalid or expired token", status: 401 };
  }

  return { userId: decodedToken.id, status: 200 };
}

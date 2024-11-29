// app/middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  console.log("midleware: ", token);

  // Cek jika token ada, jika tidak, arahkan ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next(); // Melanjutkan ke halaman yang diminta jika token ada
}

export const config = {
  matcher: ["/articles/form/:path*"], // Hanya berlaku pada halaman /articles/form
};

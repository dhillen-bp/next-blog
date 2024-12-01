import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl; // Dapatkan pathname dan method
  const method = req.method;

  // Cek apakah rutenya adalah API yang memerlukan autentikasi (POST/PUT)
  const protectedRoutes = [
    "/api/articles",
    "/api/categories",
    "/api/auth/signout",
  ];
  const isApiRoute = pathname.startsWith("/api");

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Jika token tidak ada dan metode POST atau PUT, blokir akses
  if (
    isProtectedRoute &&
    (method === "POST" || method === "PUT" || method === "DELETE") &&
    !token
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Mengembalikan 401 Unauthorized
  }

  // Cek jika token ada, jika tidak, arahkan ke halaman login
  if (!token && !isApiRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url)); // Redirect hanya jika bukan GET
  }

  return NextResponse.next(); // Melanjutkan ke halaman yang diminta jika token ada
}

export const config = {
  matcher: [
    "/articles/form/:path*",
    "/my-dashboard/:path*",
    "/api/articles/:path*",
    "/api/categories/:path*",
    "/api/auth/signout",
  ],
};

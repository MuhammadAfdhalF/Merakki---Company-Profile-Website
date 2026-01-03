import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET, // ✅ paksa pakai secret
  });

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("login", "1");
      url.searchParams.set("next", req.nextUrl.pathname); // bisa /admin atau /admin/
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

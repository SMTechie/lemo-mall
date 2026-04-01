import { NextResponse } from "next/server";
import { auth } from "./src/auth";

function isPrivileged(role?: string) {
  return role === "ADMIN" || role === "STAFF";
}

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "ADMIN") {
      const denied = new URL("/verify", req.nextUrl);
      denied.searchParams.set("reason", "admin-only");
      return NextResponse.redirect(denied);
    }
  }

  if (pathname.startsWith("/verify")) {
    if (!user) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (!isPrivileged(user.role)) {
      const denied = new URL("/", req.nextUrl);
      denied.searchParams.set("reason", "staff-only");
      return NextResponse.redirect(denied);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/verify/:path*"],
};

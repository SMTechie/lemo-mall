import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "development-only-secret-change-before-deploy"
  });

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", nextUrl));

    const permissions = (token.permissions ?? []) as string[];
    const routePermissions: Array<[string, string]> = [
      ["/admin/analytics", "view_analytics"],
      ["/admin/campaigns", "manage_users"],
      ["/admin/check-in", "scan_tickets"],
      ["/admin/discounts", "manage_discounts"],
      ["/admin/events", "manage_events"],
      ["/admin/orders", "view_orders"],
      ["/admin/pricing", "manage_events"],
      ["/admin/products", "manage_products"],
      ["/admin/rbac", "manage_users"],
      ["/admin/refunds", "issue_refunds"],
      ["/admin/scanner", "scan_tickets"],
      ["/admin/support", "manage_orders"],
      ["/admin/tenants", "manage_billing"],
      ["/admin/users", "manage_users"]
    ];

    const match = routePermissions.find(([path]) => nextUrl.pathname.startsWith(path));
    if (match && !permissions.includes(match[1])) return NextResponse.redirect(new URL("/", nextUrl));
    if (!match && permissions.length === 0) return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/account") && !token) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"]
};

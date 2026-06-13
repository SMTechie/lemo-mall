import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

function redirectUrl(req: NextRequest, path: string) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "") ?? "https";

  if (host) {
    return new URL(path, `${protocol}://${host}`);
  }

  return new URL(path, req.nextUrl);
}

export default async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "development-only-secret-change-before-deploy"
  });

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(redirectUrl(req, "/login"));

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
    if (match && !permissions.includes(match[1])) return NextResponse.redirect(redirectUrl(req, "/"));
    if (!match && permissions.length === 0) return NextResponse.redirect(redirectUrl(req, "/"));
  }

  if (nextUrl.pathname.startsWith("/account") && !token) {
    return NextResponse.redirect(redirectUrl(req, "/login"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"]
};

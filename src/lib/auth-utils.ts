import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PERMISSIONS, type PermissionName } from "@/lib/permissions";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!session.user.permissions?.some((permission) => PERMISSIONS.includes(permission as PermissionName))) redirect("/");
  return session;
}

export async function requireStaff(roles = ["SUPER_ADMIN", "TENANT_OWNER", "ADMIN", "MANAGER", "EVENT_MANAGER", "SCANNER_STAFF", "SUPPORT_STAFF"]) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!roles.some((role) => session.user.roles?.includes(role) || session.user.role === role)) redirect("/");
  return session;
}

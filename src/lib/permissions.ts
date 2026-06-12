import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const PERMISSIONS = [
  "manage_products",
  "manage_events",
  "manage_orders",
  "view_orders",
  "view_analytics",
  "manage_users",
  "manage_billing",
  "scan_tickets",
  "issue_refunds",
  "manage_discounts"
] as const;

export type PermissionName = (typeof PERMISSIONS)[number];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, PermissionName[]> = {
  SUPER_ADMIN: [...PERMISSIONS],
  TENANT_OWNER: [...PERMISSIONS],
  ADMIN: [
    "manage_products",
    "manage_events",
    "manage_orders",
    "view_orders",
    "view_analytics",
    "manage_users",
    "scan_tickets",
    "issue_refunds",
    "manage_discounts"
  ],
  MANAGER: ["manage_products", "manage_events", "manage_orders", "view_orders", "view_analytics", "scan_tickets", "manage_discounts"],
  EVENT_MANAGER: ["manage_events", "view_orders", "view_analytics", "scan_tickets", "manage_discounts"],
  SCANNER_STAFF: ["scan_tickets"],
  SUPPORT_STAFF: ["view_orders", "manage_orders", "issue_refunds"],
  CUSTOMER: []
};

export class ForbiddenError extends Error {
  status = 403;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getUserAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } }
            }
          }
        }
      }
    }
  });

  if (!user) return { tenantId: null, roles: [] as string[], permissions: [] as PermissionName[] };

  const roleNames = new Set<string>(user.roles.map((entry) => entry.role.name));
  roleNames.add(user.role);

  const permissionNames = new Set<PermissionName>();
  for (const entry of user.roles) {
    for (const permission of entry.role.permissions) {
      if (PERMISSIONS.includes(permission.permission.name as PermissionName)) {
        permissionNames.add(permission.permission.name as PermissionName);
      }
    }
  }

  for (const permission of DEFAULT_ROLE_PERMISSIONS[user.role] ?? []) {
    permissionNames.add(permission);
  }

  return {
    tenantId: user.tenantId,
    roles: [...roleNames],
    permissions: [...permissionNames]
  };
}

export async function requirePermission(permission: PermissionName) {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) throw new ForbiddenError("Authentication required");
  const permissions = session.user.permissions ?? [];
  if (!permissions.includes(permission)) throw new ForbiddenError(`Missing permission: ${permission}`);
  return session;
}

export async function requireRole(role: string) {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) throw new ForbiddenError("Authentication required");
  const roles = session.user.roles ?? [];
  if (!roles.includes(role)) throw new ForbiddenError(`Missing role: ${role}`);
  return session;
}

export function can(permissions: string[] | undefined, permission: PermissionName) {
  return Boolean(permissions?.includes(permission));
}

export async function logActivity(input: {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const { auth } = await import("@/auth");
  const session = await auth();
  await prisma.activityLog.create({
    data: {
      tenantId: session?.user?.tenantId,
      userId: session?.user?.id,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata === undefined ? undefined : (input.metadata as Prisma.InputJsonObject)
    }
  });
}

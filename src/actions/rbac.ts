"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS, logActivity, requirePermission, type PermissionName } from "@/lib/permissions";
import { adminCreateUserSchema, roleBuilderSchema } from "@/lib/validators";

function referralCode(name: string) {
  const prefix = name.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "USER";
  return `${prefix}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function requestedPermissions(formData: FormData) {
  return formData
    .getAll("permissions")
    .map(String)
    .filter((permission): permission is PermissionName => PERMISSIONS.includes(permission as PermissionName));
}

export async function createRoleAction(formData: FormData) {
  const session = await requirePermission("manage_users");
  const parsed = roleBuilderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid role");

  const selected = requestedPermissions(formData);
  const isSuperAdmin = session.user.roles.includes("SUPER_ADMIN");
  const allowed = isSuperAdmin ? selected : selected.filter((permission) => session.user.permissions.includes(permission));
  const tenantId = session.user.tenantId;
  if (!tenantId) throw new Error("Tenant context is required to create roles");

  const permissions = await prisma.permission.findMany({ where: { name: { in: allowed } } });

  const role = await prisma.role.upsert({
    where: {
      tenantId_name: {
        tenantId,
        name: parsed.data.name
      }
    },
    update: {
      description: parsed.data.description,
      permissions: {
        deleteMany: {},
        create: permissions.map((permission) => ({ permissionId: permission.id }))
      }
    },
    create: {
      tenantId,
      name: parsed.data.name,
      description: parsed.data.description,
      permissions: {
        create: permissions.map((permission) => ({ permissionId: permission.id }))
      }
    }
  });

  await logActivity({ action: "role.saved", entityType: "Role", entityId: role.id, metadata: { permissions: allowed } });
  revalidatePath("/admin/rbac");
}

export async function createUserAction(formData: FormData) {
  const session = await requirePermission("manage_users");
  const parsed = adminCreateUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Enter valid user details");

  const tenantId = session.user.tenantId;
  if (!tenantId) throw new Error("Tenant context is required to create users");

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) throw new Error("An account already exists for that email");

  const isSuperAdmin = session.user.roles.includes("SUPER_ADMIN");
  const role = parsed.data.roleId
    ? await prisma.role.findUnique({
        where: { id: parsed.data.roleId },
        include: { permissions: { include: { permission: true } } }
      })
    : null;

  if (parsed.data.roleId && !role) throw new Error("Role not found");
  if (role && !isSuperAdmin && role.tenantId !== tenantId) throw new Error("Cannot assign a role outside your tenant");

  const rolePermissions = role?.permissions.map((entry) => entry.permission.name as PermissionName) ?? [];
  const canGrant = isSuperAdmin || rolePermissions.every((permission) => session.user.permissions.includes(permission));
  if (!canGrant) throw new Error("Cannot assign permissions you do not have");

  const user = await prisma.user.create({
    data: {
      tenantId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      role: "CUSTOMER",
      referralCode: referralCode(parsed.data.name),
      roles: role ? { create: { roleId: role.id } } : undefined
    }
  });

  await logActivity({
    action: "user.created",
    entityType: "User",
    entityId: user.id,
    metadata: { email: user.email, roleId: role?.id }
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/rbac");
  redirect(`/admin/users/${user.id}`);
}

export async function assignRoleAction(formData: FormData) {
  const session = await requirePermission("manage_users");
  const userId = String(formData.get("userId"));
  const roleId = String(formData.get("roleId"));

  const [user, role] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.role.findUnique({ where: { id: roleId }, include: { permissions: { include: { permission: true } } } })
  ]);

  if (!user || !role) throw new Error("User or role not found");
  const isSuperAdmin = session.user.roles.includes("SUPER_ADMIN");
  if (!isSuperAdmin && role.tenantId !== session.user.tenantId) throw new Error("Cannot assign a role outside your tenant");
  if (!isSuperAdmin && user.tenantId !== session.user.tenantId) throw new Error("Cannot assign users outside your tenant");

  const rolePermissions = role.permissions.map((entry) => entry.permission.name);
  const canGrant = isSuperAdmin || rolePermissions.every((permission) => session.user.permissions.includes(permission));
  if (!canGrant) throw new Error("Cannot assign permissions you do not have");

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId } },
    update: {},
    create: { userId, roleId }
  });

  await logActivity({ action: "role.assigned", entityType: "User", entityId: userId, metadata: { roleId } });
  revalidatePath("/admin/rbac");
  revalidatePath(`/admin/users/${userId}`);
}

export async function removeUserRoleAction(userId: string, roleId: string) {
  await requirePermission("manage_users");
  await prisma.userRole.delete({ where: { userId_roleId: { userId, roleId } } });
  await logActivity({ action: "role.removed", entityType: "User", entityId: userId, metadata: { roleId } });
  revalidatePath("/admin/rbac");
  revalidatePath(`/admin/users/${userId}`);
}

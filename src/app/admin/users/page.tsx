import Link from "next/link";
import { Plus, X } from "lucide-react";
import { createUserAction } from "@/actions/rbac";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminUsersPage({ searchParams }: { searchParams?: Promise<{ create?: string }> }) {
  const params = await searchParams;
  const session = await auth();
  const canManageUsers = session?.user.permissions.includes("manage_users");
  const showCreateForm = canManageUsers && params?.create === "1";
  const tenantId = session?.user.tenantId;
  const isSuperAdmin = session?.user.roles.includes("SUPER_ADMIN");

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      where: isSuperAdmin ? {} : tenantId ? { tenantId } : { id: "__no_user__" },
      include: {
        roles: { include: { role: true } },
        _count: { select: { orders: true, tickets: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    }),
    prisma.role.findMany({
      where: tenantId ? { OR: [{ tenantId }, { tenantId: null }] } : { tenantId: null },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Users</h1>
          <p className="text-muted-foreground">Create accounts, review customer activity and manage staff access.</p>
        </div>
        {canManageUsers ? (
          <Button asChild>
            <Link href={showCreateForm ? "/admin/users" : "/admin/users?create=1"}>
              {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreateForm ? "Close form" : "Add user"}
            </Link>
          </Button>
        ) : null}
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/users" title="Create user" description="Add a customer or staff account and assign access if needed.">
          <form action={createUserAction} className="grid gap-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input name="name" placeholder="Jane Mokoena" required />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="jane@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input name="phone" inputMode="tel" placeholder="27821234567" />
              </div>
              <div className="grid gap-2">
                <Label>Temporary password</Label>
                <Input name="password" type="password" minLength={8} required />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label>Role</Label>
                <select name="roleId" className="h-10 rounded-md border bg-background px-3 text-sm">
                  <option value="">Customer only</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">Staff permissions are controlled by the selected role.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button asChild variant="outline"><Link href="/admin/users">Cancel</Link></Button>
              <Button>Create user</Button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All users</CardTitle>
              <CardDescription>{users.length} user{users.length === 1 ? "" : "s"} in this workspace.</CardDescription>
            </div>
            {canManageUsers && !showCreateForm ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/users?create=1"><Plus className="h-4 w-4" />Add user</Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const roleNames = user.roles.length > 0 ? user.roles.map((entry) => entry.role.name) : [user.role];
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {roleNames.map((roleName) => (
                          <Badge key={roleName} variant={roleName === "CUSTOMER" ? "outline" : "secondary"}>
                            {roleName.replaceAll("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{user._count.orders}</TableCell>
                    <TableCell>{user._count.tickets}</TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString("en-ZA")}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/users/${user.id}`}>Profile</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No users yet. Use Add user to create the first account.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

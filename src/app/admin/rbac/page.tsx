import Link from "next/link";
import { Plus, UserPlus, X } from "lucide-react";
import { assignRoleAction, createRoleAction, removeUserRoleAction } from "@/actions/rbac";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { AdminModal } from "@/components/admin/admin-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminRbacPage({ searchParams }: { searchParams?: Promise<{ create?: string; assign?: string }> }) {
  const params = await searchParams;
  const showCreateForm = params?.create === "1";
  const showAssignForm = params?.assign === "1";
  const [roles, users] = await Promise.all([
    prisma.role.findMany({
      include: { permissions: { include: { permission: true } }, users: { include: { user: true } } },
      orderBy: [{ tenantId: "asc" }, { name: "asc" }]
    }),
    prisma.user.findMany({ orderBy: { email: "asc" }, take: 200 })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Roles</h1>
          <p className="text-muted-foreground">Create roles, assign staff access and review permissions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={showAssignForm ? "/admin/rbac" : "/admin/rbac?assign=1"}>
              {showAssignForm ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {showAssignForm ? "Close assign" : "Assign role"}
            </Link>
          </Button>
          <Button asChild>
            <Link href={showCreateForm ? "/admin/rbac" : "/admin/rbac?create=1"}>
              {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreateForm ? "Close form" : "Create role"}
            </Link>
          </Button>
        </div>
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/rbac" title="Create custom role" description="Build a role and choose the permissions it should grant.">
            <form action={createRoleAction} className="grid gap-5">
              <div className="grid gap-2"><Label>Name</Label><Input name="name" placeholder="BOX_OFFICE_MANAGER" required /></div>
              <div className="grid gap-2"><Label>Description</Label><Textarea name="description" /></div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="grid gap-2 rounded-md border p-3">
                  {PERMISSIONS.map((permission) => (
                    <label key={permission} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="permissions" value={permission} />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button asChild variant="outline"><Link href="/admin/rbac">Cancel</Link></Button>
                <Button>Save role</Button>
              </div>
            </form>
        </AdminModal>
      ) : null}

      {showAssignForm ? (
        <AdminModal closeHref="/admin/rbac" title="Assign role" description="Grant an existing role to a user in this workspace.">
            <form action={assignRoleAction} className="grid gap-5">
              <div className="grid gap-2">
                <Label>User</Label>
                <select name="userId" className="h-10 rounded-md border bg-background px-3 text-sm">
                  {users.map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <select name="roleId" className="h-10 rounded-md border bg-background px-3 text-sm">
                  {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button asChild variant="outline"><Link href="/admin/rbac">Cancel</Link></Button>
                <Button>Assign role</Button>
              </div>
            </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Roles and permissions</CardTitle>
              <CardDescription>{roles.length} role{roles.length === 1 ? "" : "s"} configured.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {!showAssignForm ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/rbac?assign=1"><UserPlus className="h-4 w-4" />Assign role</Link>
                </Button>
              ) : null}
              {!showCreateForm ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/rbac?create=1"><Plus className="h-4 w-4" />Create role</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Permissions</TableHead><TableHead>Users</TableHead></TableRow></TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <p className="font-medium">{role.name}</p>
                    {role.description ? <p className="text-xs text-muted-foreground">{role.description}</p> : null}
                  </TableCell>
                  <TableCell className="max-w-lg">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((entry) => <Badge key={entry.permissionId} variant="outline">{entry.permission.name}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="space-y-2">
                    {role.users.map((entry) => (
                      <form key={entry.userId} action={removeUserRoleAction.bind(null, entry.userId, role.id)} className="flex items-center gap-2">
                        <span className="text-sm">{entry.user.email}</span>
                        <Button size="sm" variant="ghost">Remove</Button>
                      </form>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    No roles yet. Use Create role to build staff access.
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

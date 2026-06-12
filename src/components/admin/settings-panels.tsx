"use client";

import { useActionState } from "react";
import { updateTenantSettingsAction } from "@/actions/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TenantSettings = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  supportEmail?: string | null;
  whatsappNumber?: string | null;
  platformFeeBps: number;
  fixedTicketFeeCents: number;
  active: boolean;
  createdAt: string;
  _count: {
    users: number;
    products: number;
    events: number;
    orders: number;
  };
};

type AccessSummary = {
  roles: string[];
  permissions: string[];
  lastActivity?: {
    action: string;
    createdAt: string;
  } | null;
};

export function WorkspaceSettingsPanel({
  canManageBilling,
  tenant
}: {
  canManageBilling: boolean;
  tenant: TenantSettings | null;
}) {
  const [state, action, pending] = useActionState(updateTenantSettingsAction, {});

  if (!tenant) {
    return (
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No tenant workspace is attached to this account.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-md">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Workspace settings</CardTitle>
          <Badge variant={tenant.active ? "secondary" : "outline"}>{tenant.active ? "Active" : "Inactive"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tenantName">Business name</Label>
            <Input id="tenantName" name="name" defaultValue={tenant.name} disabled={!canManageBilling} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support email</Label>
              <Input id="supportEmail" name="supportEmail" type="email" defaultValue={tenant.supportEmail ?? ""} disabled={!canManageBilling} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsappNumber">WhatsApp number</Label>
              <Input id="whatsappNumber" name="whatsappNumber" inputMode="numeric" defaultValue={tenant.whatsappNumber ?? ""} disabled={!canManageBilling} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="platformFeeBps">Platform fee basis points</Label>
              <Input id="platformFeeBps" name="platformFeeBps" type="number" min={0} max={3000} defaultValue={tenant.platformFeeBps} disabled={!canManageBilling} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fixedTicketFeeCents">Fixed ticket fee cents</Label>
              <Input id="fixedTicketFeeCents" name="fixedTicketFeeCents" type="number" min={0} max={100000} defaultValue={tenant.fixedTicketFeeCents} disabled={!canManageBilling} />
            </div>
          </div>
          {state.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p> : null}
          {state.success ? <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{state.success}</p> : null}
          <Button disabled={!canManageBilling || pending}>{canManageBilling ? "Save workspace" : "Billing permission required"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function WorkspaceOverviewPanel({ tenant }: { tenant: TenantSettings | null }) {
  if (!tenant) return null;

  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>Workspace overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Slug</span><span className="font-mono">{tenant.slug}</span></div>
        <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Plan</span><span className="font-semibold">{tenant.plan}</span></div>
        <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Users</span><span className="font-semibold">{tenant._count.users}</span></div>
        <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Products</span><span className="font-semibold">{tenant._count.products}</span></div>
        <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Events</span><span className="font-semibold">{tenant._count.events}</span></div>
        <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Orders</span><span className="font-semibold">{tenant._count.orders}</span></div>
      </CardContent>
    </Card>
  );
}

export function AccessSummaryPanel({ summary }: { summary: AccessSummary }) {
  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>Access & security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Assigned roles</p>
          <div className="flex flex-wrap gap-2">
            {summary.roles.map((role) => <Badge key={role} variant="outline">{role.replaceAll("_", " ")}</Badge>)}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {summary.permissions.map((permission) => <Badge key={permission} variant="muted">{permission.replaceAll("_", " ")}</Badge>)}
          </div>
        </div>
        <div className="rounded-md border p-3 text-sm">
          <p className="font-medium">Last recorded activity</p>
          <p className="mt-1 text-muted-foreground">
            {summary.lastActivity ? `${summary.lastActivity.action} on ${new Date(summary.lastActivity.createdAt).toLocaleString("en-ZA")}` : "No activity recorded yet."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { SettingsForms } from "@/components/account/settings-forms";
import { AccessSummaryPanel, WorkspaceOverviewPanel, WorkspaceSettingsPanel } from "@/components/admin/settings-panels";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const [user, tenant, lastActivity] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        image: true,
        referralCode: true,
        loyaltyPoints: true
      }
    }),
    session.user.tenantId
      ? prisma.tenant.findUnique({
          where: { id: session.user.tenantId },
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            supportEmail: true,
            whatsappNumber: true,
            platformFeeBps: true,
            fixedTicketFeeCents: true,
            active: true,
            createdAt: true,
            _count: {
              select: {
                users: true,
                products: true,
                events: true,
                orders: true
              }
            }
          }
        })
      : null,
    prisma.activityLog.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { action: true, createdAt: true }
    })
  ]);

  if (!user) return null;
  const canManageBilling = session.user.permissions?.includes("manage_billing") ?? false;
  const serializedTenant = tenant ? { ...tenant, createdAt: tenant.createdAt.toISOString() } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, workspace, access and operational defaults.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <SettingsForms user={user} />
          <WorkspaceSettingsPanel canManageBilling={canManageBilling} tenant={serializedTenant} />
        </div>
        <div className="space-y-6">
          <WorkspaceOverviewPanel tenant={serializedTenant} />
          <AccessSummaryPanel
            summary={{
              roles: session.user.roles ?? [],
              permissions: session.user.permissions ?? [],
              lastActivity: lastActivity ? { action: lastActivity.action, createdAt: lastActivity.createdAt.toISOString() } : null
            }}
          />
        </div>
      </div>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity, requirePermission } from "@/lib/permissions";
import { tenantSettingsSchema } from "@/lib/validators";

type SettingsState = { error?: string; success?: string };

export async function updateTenantSettingsAction(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await requirePermission("manage_billing");
  const parsed = tenantSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please check the workspace settings." };
  if (!session.user.tenantId) return { error: "Tenant context is required." };

  await prisma.tenant.update({
    where: { id: session.user.tenantId },
    data: {
      name: parsed.data.name,
      supportEmail: parsed.data.supportEmail ?? null,
      whatsappNumber: parsed.data.whatsappNumber ?? null,
      platformFeeBps: parsed.data.platformFeeBps,
      fixedTicketFeeCents: parsed.data.fixedTicketFeeCents
    }
  });

  await logActivity({
    action: "tenant.settings.updated",
    entityType: "Tenant",
    entityId: session.user.tenantId,
    metadata: { name: parsed.data.name }
  });
  revalidatePath("/admin/settings");

  return { success: "Workspace settings updated." };
}

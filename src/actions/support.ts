"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { contactSchema } from "@/lib/validators";

type ContactState = { error?: string; success?: string };

export async function createEnquiryAction(_: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please complete all required fields." };

  await prisma.enquiry.create({
    data: {
      ...parsed.data,
      phone: parsed.data.phone || undefined,
      channel: "WEBSITE"
    }
  });

  revalidatePath("/admin/support");
  return { success: "Thanks. We received your message and will respond soon." };
}

export async function markEnquiryResolvedAction(id: string) {
  await requirePermission("manage_orders");
  await prisma.enquiry.update({
    where: { id },
    data: { status: "RESOLVED" }
  });
  revalidatePath("/admin/support");
  redirect("/admin/support");
}

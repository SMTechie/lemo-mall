"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { enquirySchema } from "@/lib/validators";
import { redirect } from "next/navigation";
import { EnquiryStatus } from "@prisma/client";

type EnquiryActionState = {
  error?: string;
  success?: boolean;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function requireStaffAccess() {
  const session = await auth();

  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    redirect("/login");
  }

  return session;
}

export async function submitEnquiryAction(
  _state: EnquiryActionState,
  formData: FormData,
): Promise<EnquiryActionState> {
  try {
    const parsed = enquirySchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      type: formData.get("type"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });

    const session = await auth();

    if (!process.env.DATABASE_URL) {
      return {
        success: true,
      };
    }

    await prisma.enquiry.create({
      data: {
        ...parsed,
        phone: parsed.phone ?? null,
        source: "WEBSITE",
        createdById: session?.user?.id ?? null,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to send enquiry",
    };
  }
}

export async function updateEnquiryStatusAction(formData: FormData) {
  await requireStaffAccess();

  const id = asString(formData.get("id"));
  const status = asString(formData.get("status")) as EnquiryStatus | undefined;
  const notes = asString(formData.get("notes"));

  if (!id || !status) {
    redirect("/admin/enquiries?error=missing-data");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/admin/enquiries?updated=demo");
  }

  await prisma.enquiry.update({
    where: { id },
    data: {
      status,
      notes,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });

  redirect("/admin/enquiries?updated=1");
}

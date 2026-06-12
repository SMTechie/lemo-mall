"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { changePasswordSchema, profileSchema } from "@/lib/validators";

type AccountState = { error?: string; success?: string };

export async function updateProfileAction(_: AccountState, formData: FormData): Promise<AccountState> {
  const session = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please check your profile details." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      image: parsed.data.image || null
    }
  });

  revalidatePath("/account/settings");
  return { success: "Profile updated." };
}

export async function changePasswordAction(_: AccountState, formData: FormData): Promise<AccountState> {
  const session = await requireUser();
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid password and confirmation." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "Account not found." };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) }
  });

  return { success: "Password changed." };
}

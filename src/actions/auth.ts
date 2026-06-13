"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";
import { sendPasswordResetEmail } from "@/lib/mail";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "@/lib/validators";
import { createHash, randomBytes } from "node:crypto";

type AuthState = { error?: string; success?: string; resetUrl?: string };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function registerAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid name, email and password." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account already exists for that email." };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      referralCode: parsed.data.name.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
      tenantId: (await prisma.tenant.findFirst({ where: { active: true }, orderBy: { createdAt: "asc" } }))?.id
    }
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/account/orders"
  });
  return {};
}

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/account/orders"
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Invalid email or password." };
    throw error;
  }
  return {};
}

export async function forgotPasswordAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email address." };

  const generic = { success: "If that account exists, a password reset link has been sent." };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return generic;

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { identifier: parsed.data.email } });
  await prisma.verificationToken.create({
    data: {
      identifier: parsed.data.email,
      token: tokenHash,
      expires
    }
  });

  const resetUrl = absoluteUrl(`/reset-password?token=${token}`);
  const sent = await sendPasswordResetEmail(parsed.data.email, resetUrl);

  return {
    ...generic,
    resetUrl: sent || process.env.NODE_ENV === "production" ? undefined : resetUrl
  };
}

export async function resetPasswordAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid new password." };

  const tokenHash = hashToken(parsed.data.token);
  const record = await prisma.verificationToken.findUnique({ where: { token: tokenHash } });
  if (!record || record.expires < new Date()) {
    if (record) await prisma.verificationToken.delete({ where: { token: tokenHash } });
    return { error: "This reset link is invalid or expired." };
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) }
  });
  await prisma.verificationToken.delete({ where: { token: tokenHash } });

  return { success: "Password updated. You can now log in." };
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/");
}

export async function adminLogoutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}

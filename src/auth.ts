import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/mail";
import type { NextAuthConfig } from "next-auth";

const providers: NextAuthConfig["providers"] = [];
const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "lemo-fest-dev-secret";
const demoLoginEnabled =
  process.env.AUTH_DEMO_LOGIN === "true" || (process.env.AUTH_DEMO_LOGIN !== "false" && process.env.NODE_ENV !== "production");
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465;
const smtpUser = process.env.SMTP_USER ?? "";
const smtpPassword = process.env.SMTP_PASSWORD ?? "";

if (demoLoginEnabled) {
  providers.push(
    Credentials({
      id: "demo-access",
      name: "Demo Access",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";

        if (!email || !["admin@lemofest.co.za", "staff@lemofest.co.za"].includes(email)) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
          return null;
        }

        return user;
      },
    }),
  );
}

providers.push(
  Nodemailer({
    server: {
      host: process.env.SMTP_HOST ?? "localhost",
      port: smtpPort,
      secure: smtpSecure,
      ...(smtpUser && smtpPassword
        ? {
            auth: {
              user: smtpUser,
              pass: smtpPassword,
            },
          }
        : {}),
    },
    from: process.env.MAIL_FROM ?? "Lemo Fest <tickets@lemofest.co.za>",
    async sendVerificationRequest({ identifier, url }) {
      await sendMagicLinkEmail({
        to: identifier,
        url,
        host: new URL(
          process.env.AUTH_URL ??
            process.env.NEXTAUTH_URL ??
            process.env.APP_URL ??
            "http://localhost:3000",
        ).host,
      });
    },
  }),
);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as unknown as NextAuthConfig["adapter"],
  providers,
  secret: authSecret,
  trustHost: true,
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }

      return session;
    },
  },
});

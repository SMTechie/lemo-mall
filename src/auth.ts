import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/mail";
import type { NextAuthConfig } from "next-auth";

const providers: NextAuthConfig["providers"] = [];
const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "lemo-fest-dev-secret";

providers.push(
  Nodemailer({
    server: {
      host: process.env.SMTP_HOST ?? "localhost",
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: {
        user: process.env.SMTP_USER ?? "",
        pass: process.env.SMTP_PASSWORD ?? "",
      },
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

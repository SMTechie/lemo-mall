import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { getUserAccess } from "@/lib/permissions";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "development-only-secret-change-before-deploy";

function productionBaseUrl(baseUrl: string) {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (process.env.NODE_ENV === "production" && baseUrl.includes("localhost") && vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl.replace(/\/$/, "") : `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return baseUrl.replace(/\/$/, "");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        const access = await getUserAccess(user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          roles: access.roles,
          permissions: access.permissions
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.roles = user.roles ?? [];
        token.permissions = user.permissions ?? [];
      }

      if (token.id && !user) {
        const access = await getUserAccess(token.id);
        token.tenantId = access.tenantId;
        token.roles = access.roles;
        token.permissions = access.permissions;
      }
      return token;
    },
    redirect({ url, baseUrl }) {
      const safeBaseUrl = productionBaseUrl(baseUrl);

      if (url.startsWith("/")) return `${safeBaseUrl}${url}`;

      try {
        const target = new URL(url);
        if (process.env.NODE_ENV === "production" && target.hostname === "localhost") {
          return `${safeBaseUrl}${target.pathname}${target.search}${target.hash}`;
        }

        if (target.origin === safeBaseUrl) return target.toString();
      } catch {
        return safeBaseUrl;
      }

      return safeBaseUrl;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
        session.user.tenantId = token.tenantId;
        session.user.roles = token.roles ?? [];
        session.user.permissions = token.permissions ?? [];
      }
      return session;
    }
  }
});

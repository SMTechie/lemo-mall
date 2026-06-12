import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "SUPER_ADMIN" | "TENANT_OWNER" | "ADMIN" | "MANAGER" | "EVENT_MANAGER" | "SCANNER_STAFF" | "SUPPORT_STAFF" | "CUSTOMER";
      tenantId?: string | null;
      roles: string[];
      permissions: string[];
    };
  }

  interface User {
    role: "SUPER_ADMIN" | "TENANT_OWNER" | "ADMIN" | "MANAGER" | "EVENT_MANAGER" | "SCANNER_STAFF" | "SUPPORT_STAFF" | "CUSTOMER";
    tenantId?: string | null;
    roles?: string[];
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "SUPER_ADMIN" | "TENANT_OWNER" | "ADMIN" | "MANAGER" | "EVENT_MANAGER" | "SCANNER_STAFF" | "SUPPORT_STAFF" | "CUSTOMER";
    tenantId?: string | null;
    roles?: string[];
    permissions?: string[];
  }
}

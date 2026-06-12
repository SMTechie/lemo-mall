import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = ws;
}

function createClient() {
  const adapter = new PrismaNeon({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://user:password@localhost:5432/lemo_mall_missing_env?sslmode=disable"
  });
  const client = new PrismaClient({ adapter });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

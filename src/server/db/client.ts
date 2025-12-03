// src/server/db/client.ts
import { PrismaClient } from "~/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL 
})

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
    adapter
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

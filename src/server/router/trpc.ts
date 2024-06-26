// src/server/router/index.ts
import superjson from "superjson";

import { initTRPC } from "@trpc/server";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router;
export const publicProcedure = t.procedure;



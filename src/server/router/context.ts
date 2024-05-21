// src/server/router/context.ts
import * as trpc from "@trpc/server";
import {
  Session,
  getServerSession,
} from "next-auth";
import { authOptions as nextAuthOptions } from "~/app/api/auth/[...nextauth]/route";
import { prisma } from "../db/client";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  const session = await getServerSession(nextAuthOptions);
  return createContextInner({
    session,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

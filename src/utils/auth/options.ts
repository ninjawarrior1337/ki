import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";
import { env } from "~/env/server.mjs";
import { prisma } from "~/server/db/client";

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    callbacks: {
      session({ session, user }) {
        
        if (session.user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
      Discord({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
      }),
      // ...add more providers here
    ],
  };
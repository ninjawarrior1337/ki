import { getServerSession as gss } from "next-auth/next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export const getServerSession = async () => {
  const session = gss(authOptions);
  return session;
};

export const verifySession = cache(async () => {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/");
  }

  return session.user;
});

import MoodTracker from "~/components/Tracker";
import { verifySession } from "~/utils/auth/serverSession";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { year: string };
}) {
  return {
    title: `Mood Tracker - ${params.year}`,
  };
}

export default async function Page({
  params: { year },
}: {
  params: { year: string };
}) {
  const user = await verifySession();

  return (
    <>
      <h1 className="text-2xl font-black">Mood Tracker</h1>
      <h2 className="text-gradient-treelar text-5xl font-black">元気？</h2>
      <Suspense
        fallback={
          <Image width={64} height={64} alt="loading" src={"/puff.svg"}></Image>
        }
      >
        <MoodTracker year={parseInt(year)}></MoodTracker>
      </Suspense>
      <div className="dropdown dropdown-end dropdown-hover absolute right-4 top-4 h-16 w-16 p-2">
        <Image
          width={200}
          height={200}
          alt="profile picture"
          className="rounded-full"
          src={user?.image || ""}
        />
        <SignOutButton />
      </div>
    </>
  );
}

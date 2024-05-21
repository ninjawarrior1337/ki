import MoodTracker from "~/components/Tracker";
import { verifySession } from "~/utils/auth/serverSession";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

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
  const yearAsNumber = parseInt(year);

  return (
    <>
      <h1 className="text-2xl font-black">Mood Tracker</h1>
      <h2 className="text-gradient-treelar text-5xl font-black">元気？</h2>
      <div className="flex space-x-2 text-2xl font-bold">
        <Link href={`${yearAsNumber - 1}`}>-</Link>
        <h2>{year}</h2>
        <Link href={`${yearAsNumber + 1}`}>+</Link>
      </div>
      <MoodTracker year={parseInt(year)}></MoodTracker>
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

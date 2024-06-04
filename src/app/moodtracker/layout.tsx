import React, { Suspense } from "react";
import { ProfileImage } from "~/components/ProfileImage";
import SignOutButton from "./[year]/SignOutButton";
import YearControls from "./yearControls";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-2xl font-black">Mood Tracker</h1>
      <h2 className="text-gradient-treelar text-5xl font-black">元気？</h2>
      <YearControls></YearControls>
      <div className={"grid grid-flow-col grid-rows-7 gap-2"}>{children}</div>
      <Suspense>
        <div className="dropdown dropdown-end dropdown-hover absolute right-4 top-4 h-16 w-16 p-2">
          <ProfileImage />
          <SignOutButton />
        </div>
      </Suspense>
    </>
  );
}

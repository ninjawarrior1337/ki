"use client";

import { useParams } from "next/navigation";
import { getAllDaysInYear } from "~/app/utils/allDaysInYear";
import { DayNames } from "~/components/DayNames";

export function DayEntriesScaffold({ year }: { year: number }) {
  return getAllDaysInYear(year).map((d) => (
    <div
      className="h-4 w-4 animate-pulse rounded border border-gray-600"
      key={d.toDateString()}
    ></div>
  ));
}

export default function Loading() {
  const { year } = useParams();
  const yearAsNumber = parseInt(year as string);
  return (
    <>
      <DayNames year={yearAsNumber} />
      <DayEntriesScaffold year={yearAsNumber}></DayEntriesScaffold>
    </>
  );
}

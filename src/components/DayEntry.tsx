"use client"

import Link from "next/link";
import { PropsWithChildren, useMemo } from "react";
import { RouterOutput } from "~/utils/trpc/shared";

type DayEntryProps = {
    children?: React.ReactNode;
    date: Date;
    entryData?: RouterOutput["mt"]["getMoodTrackerEntries"];
};
  
export const DayEntry: React.FC<PropsWithChildren<DayEntryProps>> = ({
    children,
    date,
    entryData,
  }) => {

    const isToday = useMemo(() => {
      return date.toLocaleDateString("default", { timeZone: "UTC" }) ==
      new Date(Date.now()).toLocaleDateString();
    }, [date])
  
    const feelingColor = useMemo(() => {
      for (const e of entryData || []) {
        if (e.date.getTime() == date.getTime()) {
          switch (e.feeling) {
            case "NEGATIVE":
              return "bg-blue-800";
            case "NEUTRAL":
              return "bg-blue-600";
            case "POSITIVE":
              return "bg-blue-400";
          }
        }
      }
      return null;
    }, [entryData, date]);
  
    return (
      <Link
        scroll={false}
        prefetch={false}
        href={`/moodtracker/${date.getUTCFullYear()}/${date.valueOf()}`}
        className={`dropdown dropdown-top dropdown-hover cursor-pointer border ${isToday ? "border-info" : "border-gray-500"} h-4 w-4 rounded ${feelingColor}`}
      >
        {children}
        <div
          tabIndex={0}
          className="menu dropdown-content z-10 rounded-box bg-base-100 p-2"
        >
          {date.toLocaleDateString("default", { timeZone: "UTC" })}
        </div>
      </Link>
    );
  };
  
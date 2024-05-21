import { PropsWithChildren, Suspense, cache, useMemo } from "react";
import { RouterOutput } from "../utils/trpc/shared";
import { getServerApi } from "~/utils/trpc/server";
import Link from "next/link";

const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getAllDaysInYear = cache((year: number) => {
  const date = new Date(Date.UTC(year, 0, 1));
  const dates = [];

  while (date.getUTCFullYear() === year) {
    dates.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return dates;
});

async function DayEntriesScaffold({ year }: { year: number }) {
  return getAllDaysInYear(year).map((d) => (
    <div
      className="h-4 w-4 animate-pulse rounded border border-gray-600"
      key={d.toDateString()}
    ></div>
  ));
}

async function DayEntries({ year }: { year: number }) {
  const serverApi = await getServerApi();
  const entryData = await serverApi.mt.getMoodTrackerEntries({ year });

  return getAllDaysInYear(year).map((d) => (
    <DayEntry entryData={entryData} date={d} key={d.toDateString()}></DayEntry>
  ));
}

async function MoodTracker({year}: { year: number }) {
  return (
    <>
      <div className="flex space-x-2 text-2xl font-bold">
        <Link href={`${year - 1}`}>-</Link>
        <h2>{year}</h2>
        <Link href={`${year + 1}`}>+</Link>
      </div>
      <div className={"grid grid-flow-col grid-rows-7 gap-2"}>
        {getAllDaysInYear(year)
          .slice(0, 7)
          .map((d) => (
            <span className="my-0 text-xs" key={d.getUTCDay()}>
              {dayStrings[d.getUTCDay()]}
            </span>
          ))}
        <Suspense fallback={<DayEntriesScaffold year={year} />}>
          <DayEntries year={year}></DayEntries>
        </Suspense>
      </div>
    </>
  );
};

type DayEntryProps = {
  children?: React.ReactNode;
  date: Date;
  entryData?: RouterOutput["mt"]["getMoodTrackerEntries"];
  onClick?: () => void;
};

const DayEntry: React.FC<PropsWithChildren<DayEntryProps>> = ({
  children,
  date,
  // onClick,
  entryData,
}) => {
  const isToday =
    date.toLocaleDateString("default", { timeZone: "UTC" }) ==
    new Date(Date.now()).toLocaleDateString();

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

export default MoodTracker;

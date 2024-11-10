import { getAllDaysInYear } from "~/app/utils/allDaysInYear";
import { getServerApi } from "~/utils/trpc/server";
import { DayEntry } from "./DayEntry";
import { DayNames } from "./DayNames";

async function MoodTracker({ year }: { year: number }) {
  const serverApi = await getServerApi();
  const entryData = await serverApi.mt.getMoodTrackerEntries({ year });

  return (
    <>
      <DayNames year={year} />
      {
        getAllDaysInYear(year).map((d) => (
          <DayEntry entryData={entryData} date={d} key={d.toDateString()}></DayEntry>
        ))
      }
    </>
  );
}

export default MoodTracker;

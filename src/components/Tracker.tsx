import { PropsWithChildren, useMemo, useState } from "react";
import { RouterOutput, trpc } from "../utils/trpc";
import { MoodTrackerModal } from "./TrackerModal";

const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MoodTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [year, setYear] = useState(new Date().getUTCFullYear());
  const [modalOpen, setModalOpen] = useState(false);

  const allDaysThisYear = useMemo(() => {
    const date = new Date(Date.UTC(year, 0, 1));
    const dates = [];

    while (date.getUTCFullYear() === year) {
      dates.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }

    return dates;
  }, [year]);

  const { data: entryData, isLoading: entryDataLoading } =
    trpc.mt.getMoodTrackerEntries.useQuery({ year });

  const openDayEntry = (d: Date) => {
    setSelectedDate(d);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex space-x-2 text-2xl font-bold">
        <button onClick={() => setYear((y) => y - 1)}>-</button>
        {entryDataLoading ? <img src="puff.svg" /> : <h2>{year}</h2>}
        <button onClick={() => setYear((y) => y + 1)}>+</button>
      </div>
      <div className={"grid grid-flow-col grid-rows-7 gap-2"}>
        {allDaysThisYear.slice(0, 7).map((d) => (
          <span className="my-0 text-xs" key={d.getUTCDay()}>
            {dayStrings[d.getUTCDay()]}
          </span>
        ))}
        {allDaysThisYear.map((d) => (
          <DayEntry
            entryData={entryData}
            onClick={() => openDayEntry(d)}
            date={d}
            key={d.toDateString()}
          ></DayEntry>
        ))}
      </div>
      <MoodTrackerModal
        date={selectedDate}
        onClose={() => setModalOpen(false)}
        isOpen={modalOpen}
      />
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
  onClick,
  entryData,
}) => {
  const isToday =
    date.toLocaleDateString("default", { timeZone: "UTC" }) ==
    new Date(Date.now()).toLocaleDateString();

  const computeColor = useMemo(() => {
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
    <div
      onClick={onClick}
      className={`dropdown dropdown-top dropdown-hover cursor-pointer border ${isToday ? "border-info" : "border-gray-500"} h-4 w-4 rounded ${computeColor}`}
    >
      {children}
      <div
        tabIndex={0}
        className="menu dropdown-content rounded-box bg-base-100 p-2"
      >
        {date.toLocaleDateString("default", { timeZone: "UTC" })}
      </div>
    </div>
  );
};

export default MoodTracker;

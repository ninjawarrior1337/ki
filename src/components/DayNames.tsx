import { dayStrings, getAllDaysInYear } from "~/app/utils/allDaysInYear";

export function DayNames({year}: {year: number}) {
    return getAllDaysInYear(year)
      .slice(0, 7)
      .map((d) => (
        <span className="my-0 text-xs" key={d.getUTCDay()}>
          {dayStrings[d.getUTCDay()]}
        </span>
      ))
  }
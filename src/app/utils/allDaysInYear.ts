import { cache } from "react";

export const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const allDaysInYear = cache((year: number) => {
  const date = new Date(Date.UTC(year, 0, 1));
  const dates = [];

  while (date.getUTCFullYear() === year) {
    dates.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return dates;
});

export const getAllDaysInYear = cache(allDaysInYear)
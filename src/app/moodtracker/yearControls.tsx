"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function YearControls() {
  const { year } = useParams();
  const yearAsNumber = parseInt(year! as string);
  return (
    <div className="flex space-x-2 text-2xl font-bold">
      <Link href={`${yearAsNumber - 1}`}>-</Link>
      <h2>{yearAsNumber}</h2>
      <Link href={`${yearAsNumber + 1}`}>+</Link>
    </div>
  );
}

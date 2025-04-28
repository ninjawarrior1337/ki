import Link from "next/link";

export default function YearControls({currentYear}: {currentYear: number}) {
  return (
    <div className="flex space-x-2 text-2xl font-bold">
      <Link href={`${currentYear - 1}`}>-</Link>
      <h2>{currentYear}</h2>
      <Link href={`${currentYear + 1}`}>+</Link>
    </div>
  );
}

import { Suspense } from "react";
import { MoodTrackerModal } from "~/components/TrackerModal";

export default async function Edit({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const {date: dateStr} = await params
  const date = new Date(parseInt(dateStr));
  return (
    <div className="modal modal-open">
      <Suspense fallback={<div>Loading</div>}>
        <MoodTrackerModal date={date} />
      </Suspense>
    </div>
  );
}

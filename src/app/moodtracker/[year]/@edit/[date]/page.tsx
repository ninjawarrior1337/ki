import { Suspense } from "react";
import { MoodTrackerModal } from "~/components/TrackerModal";

export default function Edit({
  params: { date: dateStr },
}: {
  params: { date: string };
}) {
  const date = new Date(parseInt(dateStr));
  return (
    <div className="modal modal-open">
      <Suspense fallback={<div>Loading</div>}>
        <MoodTrackerModal date={date} />
      </Suspense>
    </div>
  );
}

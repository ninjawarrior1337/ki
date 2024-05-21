import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createMoodTrackerEntrySchema } from "~/server/router/mood_tracker";
import { getServerApi } from "~/utils/trpc/server";
import SubmitButton from "./FormSubmitButton";

type ModalProps = {
  date: Date;
};


async function MoodTrackerForm({ date }: ModalProps) {
  const serverApi = await getServerApi();
  const entryData = (await serverApi.mt.getMoodTrackerEntry({
    date,
  })) || {
    date,
    content: "",
    feeling: "NEUTRAL",
  };

  const updateMoodTrackerEntry = async (date: Date, formData: FormData) => {
    "use server";
    const serverApi = await getServerApi();

    const validatedFields = createMoodTrackerEntrySchema.safeParse({
      date,
      content: formData.get("content"),
      feeling: formData.get("feeling"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await serverApi.mt.createMoodTrackerEntry(validatedFields.data);

    revalidatePath(`/moodtracker/${date.getUTCFullYear()}`);
    redirect(`/moodtracker/${date.getUTCFullYear()}`);
  };

  const deleteMoodTrackerEntry = async (date: Date) => {
    "use server";

    const serverApi = await getServerApi();
    if ("id" in entryData) {
      await serverApi.mt.deleteMoodTrackerEntry({ id: entryData.id });
      revalidatePath(`/moodtracker/${date.getUTCFullYear()}`);
      redirect(`/moodtracker/${date.getUTCFullYear()}`);
    }
  };

  return (
    <>
      <form
        action={updateMoodTrackerEntry.bind(undefined, date)}
        className="flex flex-col space-y-2"
      >
        <span className="p-2 text-4xl font-bold">
          {date.toLocaleDateString("default", { timeZone: "UTC" })}
        </span>
        <label className="self-start">General sentiment</label>
        <select
          name="feeling"
          className="select select-primary"
          defaultValue={entryData.feeling}
        >
          <option disabled value="">
            Select general sentiment of today
          </option>
          <option value={"NEGATIVE"}>Negative</option>
          <option value={"NEUTRAL"}>Neutral</option>
          <option value={"POSITIVE"}>Positive</option>
        </select>
        <label className="self-start">Optional comments</label>
        <textarea
          name="content"
          defaultValue={entryData.content}
          placeholder="Comments about your day"
          rows={4}
          className="textarea textarea-primary"
        ></textarea>
        <div className="flex flex-row items-center justify-evenly space-y-2">
          <SubmitButton/>
          <button
            formAction={deleteMoodTrackerEntry.bind(undefined, date)}
            className={`btn btn-error ${!("id" in entryData) && "btn-disabled"}`}
          >
            Delete
          </button>
        </div>
      </form>
    </>
  );
}

export const MoodTrackerModal: React.FC<ModalProps> = ({ date }) => {
  return (
    <div className={`modal modal-open`}>
      <div className="modal-box relative flex flex-col items-center">
        <Link
          href="./"
          className="btn btn-circle btn-error btn-sm absolute right-2 top-2"
        >
          x
        </Link>
        <MoodTrackerForm date={date} />
      </div>
    </div>
  );
};

import MoodTracker from "~/components/Tracker";

export async function generateMetadata({
  params,
}: PageProps<"/moodtracker/[year]">) {
  const {year} = await params
  return {
    title: `Mood Tracker - ${year}`,
  };
}

export default async function Page({ params }: { params: Promise<{ year: string }> }) {
  const p = await params
  return <MoodTracker year={parseInt(p.year)}></MoodTracker>;
}

import MoodTracker from "~/components/Tracker";

export async function generateMetadata({
  params,
}: {
  params: { year: string };
}) {
  return {
    title: `Mood Tracker - ${params.year}`,
  };
}

export default async function Page({ params }: { params: { year: string } }) {
  return <MoodTracker year={parseInt(params.year)}></MoodTracker>;
}

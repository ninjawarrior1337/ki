import YearControls from "../yearControls";

export default async function Layout({
  children,
  edit,
  params
}: {
  children: React.ReactElement;
  edit: React.ReactElement;
  params: Promise<{year: string}>
}) {
  const {year} = await params
  const yearAsNumber = parseInt(year! as string);

  return (
    <>
      {edit}
      <YearControls currentYear={yearAsNumber}></YearControls>
      <div className={"grid grid-flow-col grid-rows-7 gap-2"}>{children}</div>
    </>
  );
}

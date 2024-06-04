export default function Layout({
  children,
  edit,
}: {
  children: React.ReactElement;
  edit: React.ReactElement;
}) {
  return (
    <>
      {edit}
      {children}
    </>
  );
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen flex flex-col gap-12 items-center justify-center p-2">
      {children}
    </div>
  );
}

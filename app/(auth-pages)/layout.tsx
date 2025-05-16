import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen flex flex-col gap-12 items-center justify-center p-2">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}

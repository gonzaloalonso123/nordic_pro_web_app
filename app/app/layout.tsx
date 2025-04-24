import PlatformHeader from "@/components/platform/platform-header";
import PlatformSidebar from "@/components/platform/platform-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <PlatformHeader />
      <div className="flex flex-1">
        <PlatformSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

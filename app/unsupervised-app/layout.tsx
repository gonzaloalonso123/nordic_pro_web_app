import type React from "react";
import MobilePlatformHeader from "@/unsupervised-components/mobile-platform-header";
import MobilePlatformNavbar from "@/unsupervised-components/mobile-platform-navbar";
import PlatformHeader from "@/components/platform/platform-header";
import PlatformSidebar from "@/components/platform/platform-sidebar";

function PlatformLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MobilePlatformHeader />
      <main className={`flex-1 p-4 pb-20 overflow-hidden`}>{children}</main>
      <MobilePlatformNavbar />
    </div>
  );
}

export default PlatformLayoutClient;

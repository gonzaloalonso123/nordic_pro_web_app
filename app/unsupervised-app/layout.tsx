"use client";

import type React from "react";
import MobilePlatformHeader from "@/unsupervised-components/mobile-platform-header";
import MobilePlatformNavbar from "@/unsupervised-components/mobile-platform-navbar";
import PlatformHeader from "@/components/platform/platform-header";
import PlatformSidebar from "@/components/platform/platform-sidebar";
import { usePathname } from "next/navigation";

import { Inter, Montserrat } from "next/font/google";
import { useMobile } from "@/hooks/use-mobile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

function PlatformLayoutClient({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile();
  const pathname = usePathname();
  const isChatPage = pathname === "/platform/chat";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile ? (
        <>
          <main
            className={`flex-1 ${isChatPage ? "p-2" : "p-4"} pb-20 overflow-hidden`}
          >
            {children}
          </main>
          <MobilePlatformNavbar />
        </>
      ) : (
        <>
          <PlatformHeader />
          <div className="flex flex-1">
            <PlatformSidebar />
            <main
              className={`flex-1 ${isChatPage ? "p-4" : "p-6"} overflow-hidden`}
            >
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default PlatformLayoutClient;

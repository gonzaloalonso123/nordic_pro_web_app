import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/reactQueryProvider";
import PWAViewportManager from "@/components/pwa/PWAViewportManager";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoadingIndicator } from "@/components/ui/loading-indicators";


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

export const metadata: Metadata = {
  title: "NordicPro Platform",
  description: "Mental health, motivation, and team management in one place.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body
          className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-gray-50`}
        >
          <LoadingProvider>
            <GlobalLoadingIndicator />
            <PWAViewportManager />
            <main className="grow">{children}</main>
          </LoadingProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}

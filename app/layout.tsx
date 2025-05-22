import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/reactQueryProvider";

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

export default function PlatformLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </head>
        <body
          className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-gray-50`}
        >
          <div className="min-h-screen flex flex-col">{children}</div>
        </body>
      </html>
    </ReactQueryProvider>
  );
}

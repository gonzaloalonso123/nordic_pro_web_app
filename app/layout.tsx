import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/reactQueryProvider";
import { ThemeProvider } from "@/providers/theme-provider";

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

export default function RootLayout({ // Renamed from PlatformLayout to RootLayout for clarity as it's the root layout
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}

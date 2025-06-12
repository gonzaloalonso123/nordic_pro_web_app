import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/reactQueryProvider";
import PWAViewportManager from "@/components/pwa/PWAViewportManager";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoadingIndicator } from "@/components/ui/loading-indicators";
import SplashScreenProvider from "@/components/SplashScreenProvider";

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
  title: "Nordic Pro",
  description: "Keep Players In The Game",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "pwa", "progressive web app"],
  authors: [{ name: "NordicPro" }],
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
    { rel: "icon", url: "/icon-192x192.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Nordic Pro" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-tap-highlight" content="no" />

          {/* Splash Screen for iOS PWA */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" />

          {/* Device-specific splash screens for better PWA experience */}
          {/* iPhone 15 Pro Max, 14 Pro Max */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 15 Pro, 14 Pro */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 15, 15 Plus, 14, 14 Plus */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 13 Pro Max, 12 Pro Max */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 13, 13 Pro, 12, 12 Pro */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 11 Pro Max, XS Max */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 11, XR */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />

          {/* iPhone 11 Pro, XS, X */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 8 Plus, 7 Plus */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />

          {/* iPhone 8, 7, 6s, 6 */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />

          {/* iPhone SE 3rd gen, SE 2nd gen */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />

          {/* iPhone SE 1st gen, 5s */}
          <link rel="apple-touch-startup-image" href="/splash-screen.svg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />

          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body
          className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-gray-50`}
        >
          <LoadingProvider>
            <GlobalLoadingIndicator />
            <PWAViewportManager />
            <SplashScreenProvider>
              <main className="grow safe-area">{children}</main>
            </SplashScreenProvider>
          </LoadingProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}

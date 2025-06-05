"use client";

import { ReactNode } from "react";
import SplashScreen from "./SplashScreen";
import { useSplashScreen } from "@/hooks/useSplashScreen";

interface SplashScreenProviderProps {
  children: ReactNode;
}

export default function SplashScreenProvider({ children }: SplashScreenProviderProps) {
  const { showSplash, hideSplash } = useSplashScreen();

  // Don't render children until splash is done - like native apps
  if (showSplash) {
    return <SplashScreen onFinish={hideSplash} />;
  }
  return <>{children}</>;
}

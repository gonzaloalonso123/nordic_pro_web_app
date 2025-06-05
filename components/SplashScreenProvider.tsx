"use client";

import { ReactNode } from "react";
import SplashScreen from "./SplashScreen";
import { useSplashScreen } from "@/hooks/useSplashScreen";

interface SplashScreenProviderProps {
  children: ReactNode;
}

export default function SplashScreenProvider({ children }: SplashScreenProviderProps) {
  const { showSplash, hideSplash } = useSplashScreen();

  return (
    <>
      {showSplash && <SplashScreen onFinish={hideSplash} />}
      {children}
    </>
  );
}

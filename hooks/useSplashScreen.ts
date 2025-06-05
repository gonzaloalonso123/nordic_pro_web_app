"use client";

import { useState, useEffect } from "react";

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("nordic-pro-splash-shown");

    if (hasSeenSplash) {
      setShowSplash(false);
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsLoading(false);
        sessionStorage.setItem("nordic-pro-splash-shown", "true");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  return {
    showSplash,
    isLoading,
    hideSplash: () => {
      setShowSplash(false);
      setIsLoading(false);
      sessionStorage.setItem("nordic-pro-splash-shown", "true");
    }
  };
}


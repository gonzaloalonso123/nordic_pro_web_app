"use client";

import { useState, useEffect } from "react";
import { usePWA } from "./usePWA";

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isPWA } = usePWA();

  useEffect(() => {
    if (isPWA) {
      setShowSplash(true);

      // Wait for app to be ready (DOM + images loaded)
      const handleAppReady = () => {
        // Minimum splash time for branding (like native apps)
        const minSplashTime = 1500;
        const startTime = Date.now();

        const finishSplash = () => {
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, minSplashTime - elapsed);

          const timeoutId = setTimeout(() => {
            setShowSplash(false);
            setIsLoading(false);
          }, remainingTime);

          // Return cleanup function
          return () => clearTimeout(timeoutId);
        };

        return finishSplash();
      };

      let cleanup: (() => void) | undefined;
      let loadHandler: (() => void) | undefined;

      // Wait for everything to load
      if (document.readyState === 'complete') {
        cleanup = handleAppReady();
      } else {
        loadHandler = () => {
          cleanup = handleAppReady();
        };

        window.addEventListener('load', loadHandler, { once: true });
      }

      // Return cleanup function for useEffect
      return () => {
        if (loadHandler) {
          window.removeEventListener('load', loadHandler);
        }
        cleanup?.();
      };
    } else {
      // Not in PWA mode - don't show splash
      setShowSplash(false);
      setIsLoading(false);
    }
  }, [isPWA]);

  return {
    showSplash,
    isLoading,
    hideSplash: () => {
      setShowSplash(false);
      setIsLoading(false);
    }
  };
}


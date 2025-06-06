"use client";

import { useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";

export default function PWAViewportManager() {
  const { isPWA, isStandalone } = usePWA();

  useEffect(() => {
    let viewportMeta = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;

    if (!viewportMeta) {
      // Create viewport meta tag if it doesn't exist
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandaloneIOS =
      isIOS && (window.navigator as any).standalone === true;
    const isStandaloneAndroid = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    if (isPWA || isStandalone || isStandaloneIOS || isStandaloneAndroid) {
      viewportMeta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover";
    } else {
      // Allow zoom for desktop/web browsers
      viewportMeta.content = "width=device-width, initial-scale=1.0";
    }
  }, [isPWA, isStandalone]);

  return null;
}

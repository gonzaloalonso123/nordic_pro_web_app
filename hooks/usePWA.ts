"use client";

import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.matchMedia('(display-mode: fullscreen)').matches;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches ||
      ('ontouchstart' in window);

    setIsStandalone(isStandaloneMode);
    setIsPWA(isStandaloneMode && isMobile);
  }, []);

  return { isPWA, isStandalone };
};


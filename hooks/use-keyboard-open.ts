import { useEffect, useState } from "react";

export function useKeyboardOpen(threshold = 100) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const initialHeight = window.visualViewport.height;

    const onResize = () => {
      const heightDiff = initialHeight - window.visualViewport.height;
      setKeyboardOpen(heightDiff > threshold);
    };

    window.visualViewport.addEventListener("resize", onResize);

    return () => window.visualViewport.removeEventListener("resize", onResize);
  }, [threshold]);

  return keyboardOpen;
}

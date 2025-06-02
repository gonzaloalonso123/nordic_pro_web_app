"use client";

import { useLoading } from "@/contexts/LoadingContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function GlobalLoadingIndicator() {
  const { isNavigating, setIsNavigating, setLoadingPath } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state when route changes
    setIsNavigating(false);
    setLoadingPath(null);
  }, [pathname, setIsNavigating, setLoadingPath]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary h-1">
      <div className="h-full bg-primary-foreground animate-pulse" />
    </div>
  );
}

export function PageLoadingOverlay() {
  const { isNavigating } = useLoading();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-background border shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}


"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonVariantProps {
  type: "avatar" | "badge" | "button" | "card" | "list-item";
  className?: string;
}

export function SkeletonVariant({ type, className }: SkeletonVariantProps) {
  switch (type) {
    case "avatar":
      return (
        <div className={cn("flex items-center space-x-3", className)}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      );

    case "badge":
      return <Skeleton className={cn("h-5 w-16 rounded-full", className)} />;

    case "button":
      return <Skeleton className={cn("h-9 w-20 rounded-md", className)} />;

    case "card":
      return (
        <div className={cn("space-y-3", className)}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      );

    case "list-item":
      return (
        <div className={cn("flex items-center space-x-3", className)}>
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      );

    default:
      return <Skeleton className={cn("h-4 w-full", className)} />;
  }
}

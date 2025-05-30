"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface MembersTableLoadingVariantsProps {
  variant?: "default" | "compact" | "detailed";
  rows?: number;
}

export function MembersTableLoadingVariants({
  variant = "default",
  rows = 5,
}: MembersTableLoadingVariantsProps) {
  const { t } = useTranslation();

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 border rounded-lg animate-pulse"
          >
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-32" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
            <div className="flex space-x-1">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div>
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground border-b bg-muted/30">
          <div className="col-span-4">{t("Member")}</div>
          <div className="col-span-2">{t("Role")}</div>
          <div className="col-span-2">{t("Position")}</div>
          <div className="col-span-2">{t("Subscription")}</div>
          <div className="col-span-2">{t("Actions")}</div>
        </div>

        <div className="space-y-0">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index}>
              {/* Mobile View */}
              <div className="sm:hidden flex items-center space-x-3 p-4 border-b animate-pulse">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-2 sm:gap-4 p-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors animate-pulse">
                <div className="flex items-center space-x-3 sm:col-span-4">
                  <div className="relative">
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-44" />
                    <Skeleton className="h-2 w-20" />
                  </div>
                </div>

                {/* Enhanced Role */}
                <div className="flex items-center sm:col-span-2">
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-18 rounded-full" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>

                {/* Enhanced Position */}
                <div className="flex items-center sm:col-span-2">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>

                {/* Enhanced Subscription */}
                <div className="flex items-center sm:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-14" />
                      <Skeleton className="h-2 w-10" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex items-center space-x-2 sm:col-span-2 sm:justify-end">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div>
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-4">{t("Member")}</div>
        <div className="col-span-2">{t("Role")}</div>
        <div className="col-span-2">{t("Position")}</div>
        <div className="col-span-2">{t("Subscription")}</div>
        <div className="col-span-2">{t("Actions")}</div>
      </div>

      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index}>
            {/* Mobile View - Simple list item */}
            <div className="sm:hidden flex items-center space-x-3 p-4 border-b animate-pulse">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            {/* Desktop View - Full table layout */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 sm:gap-4 p-4 border-b hover:bg-muted/50 transition-colors animate-pulse">
              <div className="flex items-center space-x-3 sm:col-span-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>

              <div className="flex items-center sm:col-span-2">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <div className="flex items-center sm:col-span-2">
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex items-center sm:col-span-2">
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:col-span-2 sm:justify-end">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

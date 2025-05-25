"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { DesktopContent } from "./desktop-content";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocationSelectorProps } from "./types";
import { ResponsiveFormPopup } from "@/components/form/responsive-form-popup";
import { MobileContent } from "./mobile-content";

export const LocationSelectorPopup: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationSelect,
  organisationId,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"recent" | "map">("recent");
  const isMobile = useIsMobile();

  const handleClose = () => {
    setOpen(false);
  };

  const contentProps = {
    selectedLocation,
    onLocationSelect,
    organisationId,
    onClose: handleClose,
  };

  const formatLocationDisplay = () => {
    if (!selectedLocation) return "Select location";

    const truncatedName =
      selectedLocation.name.length > 30
        ? `${selectedLocation.name.substring(0, 30)}...`
        : selectedLocation.name;

    return truncatedName;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Location</p>
            <p className="text-xs text-muted-foreground truncate">
              {formatLocationDisplay()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ResponsiveFormPopup
            trigger={
              <Button type="button" size="sm">
                {selectedLocation ? "Change" : "Select"}
              </Button>
            }
            title="Location Selection"
            open={open}
            onOpenChange={setOpen}
            mobileClassName="h-[100svh] flex flex-col rounded-none drawer-no-close-btn"
            desktopClassName="p-0 w-full max-w-4xl mx-auto flex flex-col [&>button]:hidden rounded-lg overflow-hidden"
          >
            {isMobile ? (
              <MobileContent
                {...contentProps}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
              <DesktopContent {...contentProps} />
            )}
          </ResponsiveFormPopup>
        </div>
      </div>
    </div>
  );
};

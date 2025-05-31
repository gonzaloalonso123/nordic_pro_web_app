"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Clock, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TabContent, TabContentProps } from "./tab-content";

interface DesktopContentProps extends Omit<TabContentProps, "activeTab"> {
  activeTab: "datetime" | "preview";
  setActiveTab: (tab: "datetime" | "preview") => void;
  handleDone: () => void;
  previewEvents: Array<{
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  }>;
}

export const Content: React.FC<DesktopContentProps> = ({
  activeTab,
  setActiveTab,
  handleDone,
  previewEvents,
  ...tabContentProps
}) => {
  return (
    <>
      <div className="p-4 border-b shrink-0">
        <h2 className="text-xl font-semibold">Event Settings</h2>
      </div>

      <div className="p-4 border-b shrink-0">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={activeTab === "datetime" ? "default" : "outline-solid"}
            className={cn(
              "justify-start",
              activeTab === "datetime"
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
                : ""
            )}
            onClick={() => setActiveTab("datetime")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Date/Time
          </Button>
          <Button
            variant={activeTab === "preview" ? "default" : "outline-solid"}
            className={cn(
              "justify-start",
              activeTab === "preview"
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
                : ""
            )}
            onClick={() => setActiveTab("preview")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <TabContent
          activeTab={activeTab}
          {...tabContentProps}
          previewEvents={previewEvents}
        />
      </div>

      <div className="p-3 border-t shrink-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            {previewEvents.length > 1
              ? `${previewEvents.length} occurrences`
              : "One-time event"}
          </p>
          <Button
            onClick={handleDone}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 h-8"
          >
            Save Date{previewEvents.length > 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </>
  );
};

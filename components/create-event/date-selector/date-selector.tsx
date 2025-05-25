"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Repeat } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRecurrenceLogic } from "./hooks/use-recurrence-logic";
import { Content } from "./content";
import { ResponsiveFormPopup } from "@/components/form/responsive-form-popup";

interface DateSelectorProps {
  dates?: {
    startTime: string;
    endTime: string;
    timeToCome: string | null;
    dates: string[];
  };
  setDates: (dates: {
    startTime: string;
    endTime: string;
    timeToCome?: string;
    dates: string[];
  }) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates = {
    timeToCome: null,
    startTime: "09:00",
    endTime: "10:00",
    dates: [new Date().toISOString()],
  },
  setDates,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"datetime" | "preview">(
    "datetime"
  );
  const isMobile = useIsMobile();
  const {
    recurrencePattern,
    deletedDates,
    previewEvents,
    updateRecurrencePattern,
    deleteDate,
    restoreDate,
    getFinalDates,
  } = useRecurrenceLogic(dates);

  const weekdays = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
  ];

  const handleTimeChange = (key: string, value: string) => {
    setDates({
      ...dates,
      [key]: value,
    });
  };

  const toggleWeekday = (day: number) => {
    const currentWeekdays = recurrencePattern.weekdays || [];
    const newWeekdays = currentWeekdays.includes(day)
      ? currentWeekdays.filter((d) => d !== day)
      : [...currentWeekdays, day];
    updateRecurrencePattern({
      weekdays: newWeekdays.length ? newWeekdays : [day],
    });
  };

  const formatDateTimeDisplay = () => {
    try {
      const dateObj = new Date(dates.dates[0]);
      if (isNaN(dateObj.getTime())) {
        return "Set date and time";
      }
      const dateFormatted = format(dateObj, "MMM d, yyyy");
      return `${dateFormatted} at ${dates.startTime} - ${dates.endTime}`;
    } catch (error) {
      return "Set date and time";
    }
  };

  const handleDone = () => {
    setOpen(false);
    setActiveTab("datetime");
    setDates({
      ...dates,
      dates: getFinalDates(),
    });
  };

  const tabContentProps = {
    dates,
    handleTimeChange,
    recurrencePattern,
    updateRecurrencePattern,
    weekdays,
    toggleWeekday,
    deleteDate,
    restoreDate,
    deletedDates,
    setDates,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Date & Time</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTimeDisplay()}
            </p>
          </div>
        </div>
        <div>
          <ResponsiveFormPopup
            trigger={
              <Button type="button" size="sm">
                Configure
              </Button>
            }
            title="Event Settings"
            open={open}
            onOpenChange={setOpen}
          >
            <Content
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleDone={handleDone}
              previewEvents={previewEvents}
              {...tabContentProps}
            />
          </ResponsiveFormPopup>
        </div>
      </div>

      {previewEvents.length > 1 && (
        <div className="flex items-center justify-between border rounded-md p-3">
          <div className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Recurrence</p>
              <p className="text-xs text-muted-foreground">
                {`${previewEvents.length} occurrences (${recurrencePattern.type})`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

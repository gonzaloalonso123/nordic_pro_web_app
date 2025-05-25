"use client";

import type React from "react";
import { TimeSelector } from "./time-selector";
import { DateRecurrenceForm } from "./date-recurrence-form";
import { RecurrencePreview } from "./recurrence-preview";
import type { RecurrencePattern } from "./hooks/use-recurrence-logic";

export interface TabContentProps {
  activeTab: "datetime" | "preview";
  dates: {
    timeToCome: string | null;
    startTime: string;
    endTime: string;
    dates: string[];
  };
  handleTimeChange: (key: string, value: string) => void;
  recurrencePattern: RecurrencePattern;
  updateRecurrencePattern: (updates: Partial<RecurrencePattern>) => void;
  weekdays: Array<{ value: number; label: string }>;
  toggleWeekday: (day: number) => void;
  previewEvents: Array<{
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  }>;
  deleteDate: (date: string) => void;
  restoreDate: (date: string) => void;
  deletedDates: Set<string>;
  setDates: (dates: {
    startTime: string;
    endTime: string;
    dates: string[];
  }) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  dates,
  handleTimeChange,
  recurrencePattern,
  updateRecurrencePattern,
  weekdays,
  toggleWeekday,
  previewEvents,
  deleteDate,
  restoreDate,
  deletedDates,
  setDates,
}) => (
  <>
    {activeTab === "datetime" && (
      <div className="space-y-6">
        <TimeSelector
          timeToCome={dates.timeToCome}
          startTime={dates.startTime}
          endTime={dates.endTime}
          onTimeToComeChange={(value) => handleTimeChange("timeToCome", value)}
          onStartTimeChange={(value) => handleTimeChange("startTime", value)}
          onEndTimeChange={(value) => handleTimeChange("endTime", value)}
        />
        <DateRecurrenceForm
          selectedDate={dates.dates[0]}
          onDateChange={(date) => {
            setDates({
              ...dates,
              dates: [date],
            });
          }}
          recurrencePattern={recurrencePattern}
          onRecurrenceChange={updateRecurrencePattern}
          weekdays={weekdays}
          toggleWeekday={toggleWeekday}
        />
      </div>
    )}
    {activeTab === "preview" && (
      <RecurrencePreview
        events={previewEvents}
        onDeleteDate={deleteDate}
        onRestoreDate={restoreDate}
        deletedDates={deletedDates}
      />
    )}
  </>
);

"use client";

import { addDays } from "date-fns";
import { useState, useMemo, useCallback } from "react";
import { RRule, Frequency } from "rrule";

export interface RecurrencePattern {
  type: "once" | "daily" | "weekly" | "monthly";
  interval: number;
  occurrences: number;
  endDate?: string;
  endType: "occurrences" | "date";
  weekdays?: number[];
  monthDay?: number;
}

interface DateConfig {
  startTime: string;
  endTime: string;
  dates: string[];
}

export const useRecurrenceLogic = (dates: DateConfig) => {
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>(
    {
      type: "once",
      interval: 1,
      occurrences: 4,
      endType: "occurrences",
      endDate: addDays(new Date(), 30).toISOString().split("T")[0],
      weekdays: [new Date().getDay()],
    }
  );
  const [deletedDates, setDeletedDates] = useState<Set<string>>(new Set());

  const createRRule = useCallback(
    (pattern: RecurrencePattern, startDate: Date): RRule | null => {
      if (pattern.type === "once") return null;

      const options: any = {
        dtstart: startDate,
        interval: pattern.interval,
      };

      switch (pattern.type) {
        case "daily":
          options.freq = Frequency.DAILY;
          break;
        case "weekly":
          options.freq = Frequency.WEEKLY;
          if (pattern.weekdays && pattern.weekdays.length > 0) {
            options.byweekday = pattern.weekdays.map((day) =>
              day === 0 ? 6 : day - 1
            );
          }
          break;
        case "monthly":
          options.freq = Frequency.MONTHLY;
          if (pattern.monthDay) {
            options.bymonthday = pattern.monthDay;
          }
          break;
      }

      if (pattern.endType === "occurrences") {
        options.count = pattern.occurrences;
      } else if (pattern.endType === "date" && pattern.endDate) {
        options.until = new Date(pattern.endDate);
      }

      try {
        return new RRule(options);
      } catch (error) {
        console.error("Error creating RRule:", error);
        return null;
      }
    },
    []
  );

  const getInitialEventTimings = useCallback((datesConfig: DateConfig) => {
    if (
      !datesConfig?.dates?.[0] ||
      !datesConfig.startTime ||
      !datesConfig.endTime
    ) {
      return null;
    }

    try {
      const selectedDateObj = new Date(datesConfig.dates[0]);
      const startDateTime = new Date(selectedDateObj);
      const endDateTime = new Date(selectedDateObj);

      const [startHours, startMinutes] = datesConfig.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = datesConfig.endTime.split(":").map(Number);

      startDateTime.setHours(startHours, startMinutes, 0, 0);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return null;
      }

      const duration = endDateTime.getTime() - startDateTime.getTime();
      return { initialStartDateTime: startDateTime, duration };
    } catch (error) {
      console.error("Error parsing initial event timings:", error);
      return null;
    }
  }, []);

  const { previewEvents, internalDates } = useMemo(() => {
    const timings = getInitialEventTimings(dates);
    if (!timings) {
      return { previewEvents: [], internalDates: [] };
    }

    const { initialStartDateTime, duration } = timings;
    let allGeneratedDates: Date[] = [];
    const tempInternalDates: string[] = [];

    if (recurrencePattern.type === "once") {
      allGeneratedDates = [initialStartDateTime];
    } else {
      const rrule = createRRule(recurrencePattern, initialStartDateTime);
      if (!rrule) {
        return { previewEvents: [], internalDates: [] };
      }
      allGeneratedDates = rrule.all().slice(0, 100);
    }

    allGeneratedDates.forEach((date, index) => {
      if (index > 0) {
        tempInternalDates.push(date.toISOString());
      }
    });

    const events = allGeneratedDates
      .filter((date) => !deletedDates.has(date.toISOString()))
      .map((date, index) => ({
        id: `day-${index}`,
        name: "Event",
        start_date: date.toISOString(),
        end_date: new Date(date.getTime() + duration).toISOString(),
      }));

    return { previewEvents: events, internalDates: tempInternalDates };
  }, [
    recurrencePattern,
    dates,
    deletedDates,
    createRRule,
    getInitialEventTimings,
  ]);

  const updateRecurrencePattern = useCallback(
    (updates: Partial<RecurrencePattern>) => {
      if (updates.type && updates.type !== recurrencePattern.type) {
        setDeletedDates(new Set());
      }
      setRecurrencePattern((prev) => ({ ...prev, ...updates }));
    },
    [recurrencePattern.type]
  );

  const deleteDate = useCallback((dateToDelete: string) => {
    setDeletedDates((prev) => new Set([...prev, dateToDelete]));
  }, []);

  const restoreDate = useCallback((dateToRestore: string) => {
    setDeletedDates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(dateToRestore);
      return newSet;
    });
  }, []);

  const getFinalDates = useCallback(() => {
    const allDates = [dates.dates[0], ...internalDates];
    return allDates.filter((date) => !deletedDates.has(date));
  }, [dates.dates, internalDates, deletedDates]);

  return {
    recurrencePattern,
    deletedDates,
    previewEvents,
    internalDates,
    updateRecurrencePattern,
    deleteDate,
    restoreDate,
    getFinalDates,
  };
};

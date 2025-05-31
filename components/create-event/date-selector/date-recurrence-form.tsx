"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { RecurrencePattern } from "./hooks/use-recurrence-logic";
import { useEffect } from "react";

interface DateRecurrenceFormProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  recurrencePattern: RecurrencePattern;
  onRecurrenceChange: (updates: Partial<RecurrencePattern>) => void;
  weekdays: Array<{ value: number; label: string }>;
  toggleWeekday: (day: number) => void;
}

export const DateRecurrenceForm: React.FC<DateRecurrenceFormProps> = ({
  selectedDate,
  onDateChange,
  recurrencePattern,
  onRecurrenceChange,
  weekdays,
  toggleWeekday,
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Repeat</Label>
          <RadioGroup
            value={recurrencePattern.type}
            onValueChange={(value) => {
              const newType = value as "once" | "daily" | "weekly" | "monthly";
              onRecurrenceChange({
                type: newType,
                occurrences:
                  newType === "once" ? 1 : recurrencePattern.occurrences,
              });
            }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="once" id="once" />
              <Label htmlFor="once">One-time (no recurrence)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
          </RadioGroup>
        </div>

        {recurrencePattern.type === "once" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-date" className="font-medium">
                Event Date
              </Label>
              <Input
                id="event-date"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>
          </div>
        )}

        {recurrencePattern.type === "weekly" && (
          <div className="space-y-3">
            <Label>Repeat on</Label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={
                    recurrencePattern.weekdays?.includes(day.value)
                      ? "default"
                      : "outline-solid"
                  }
                  size="sm"
                  className="w-12 h-10"
                  onClick={() => toggleWeekday(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {recurrencePattern.type !== "once" && (
          <>
            <div className="space-y-3">
              <Label>Repeat every</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={recurrencePattern.interval}
                  onChange={(e) =>
                    onRecurrenceChange({
                      interval: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20"
                />
                <span>
                  {recurrencePattern.type === "daily"
                    ? "days"
                    : recurrencePattern.type === "weekly"
                      ? "weeks"
                      : "months"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>End</Label>
              <RadioGroup
                value={recurrencePattern.endType}
                onValueChange={(value) =>
                  onRecurrenceChange({
                    endType: value as "occurrences" | "date",
                  })
                }
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occurrences" id="occurrences" />
                    <Label htmlFor="occurrences">After</Label>
                  </div>
                  {recurrencePattern.endType === "occurrences" && (
                    <div className="flex items-center space-x-2 ml-6">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={recurrencePattern.occurrences}
                        onChange={(e) =>
                          onRecurrenceChange({
                            occurrences: Number.parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-20"
                      />
                      <span>occurrences</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="date" id="date" />
                    <Label htmlFor="date">On date</Label>
                  </div>
                  {recurrencePattern.endType === "date" && (
                    <div className="ml-6">
                      <Input
                        type="date"
                        value={recurrencePattern.endDate || ""}
                        onChange={(e) =>
                          onRecurrenceChange({ endDate: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

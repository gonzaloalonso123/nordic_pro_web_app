"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  startTime: string;
  endTime: string;
  timeToCome: string | null;
  onStartTimeChange: (time: string) => void;
  onTimeToComeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  startTime,
  endTime,
  timeToCome,
  onStartTimeChange,
  onTimeToComeChange,
  onEndTimeChange,
}) => {
  const [beThereEarly, setBeThereEarly] = useState(false);

  const calculateDuration = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const start = new Date(`${today}T${startTime}:00`);
      const end = new Date(`${today}T${endTime}:00`);
      let durationMs = end.getTime() - start.getTime();
      if (durationMs < 0) {
        durationMs += 24 * 60 * 60 * 1000;
      }
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      if (hours === 0) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
      } else if (minutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      }
    } catch (error) {
      return "Error calculating duration";
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setBeThereEarly(checked);
    if (!checked) {
      onTimeToComeChange("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="font-medium">
            Start Time
          </Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-time" className="font-medium">
            End Time
          </Label>
          <Input
            id="end-time"
            type="time"
            min={startTime}
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="be-there-early"
              checked={beThereEarly}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="be-there-early"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Be there early
            </Label>
          </div>

          {beThereEarly && (
            <div className="space-y-2">
              <Label htmlFor="time-to-come" className="font-medium text-sm">
                Time to Come
              </Label>
              <Input
                id="time-to-come"
                type="time"
                max={startTime}
                value={timeToCome || ""}
                onChange={(e) => onTimeToComeChange(e.target.value)}
                placeholder="Select arrival time"
              />
              <p className="text-xs text-muted-foreground ml-1">
                Set when you want to arrive before the event starts
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-700">
                Duration: {calculateDuration()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This is how long your event will last. Each occurrence in a
                recurring series will have this same duration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2, RotateCcw } from "lucide-react";
import { format, parseISO } from "date-fns";
import Calendar from "../../calendar/event-calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFormContext } from "react-hook-form";

interface RecurrencePreviewProps {
  events: Array<{
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  }>;
  onDeleteDate: (date: string) => void;
  onRestoreDate: (date: string) => void;
  deletedDates: Set<string>;
}

export const RecurrencePreview: React.FC<RecurrencePreviewProps> = ({
  events,
  onDeleteDate,
  onRestoreDate,
  deletedDates,
}) => {
  const isMobile = useIsMobile();
  const form = useFormContext();
  const name = form.watch("name");
  return (
    <div>
      {events.length > 0 ? (
        <>
          <div className="bg-white p-0 rounded-md border mb-4">
            <Calendar
              events={events}
              viewChangable={false}
              onEventClick={(event) => {
                onDeleteDate(event.start_date);
              }}
              height={!isMobile ? 450 : 500}
            />
          </div>

          <div className="space-y-2 mt-4 mb-10">
            <h4 className="text-sm font-medium">
              All Occurrences ({events.length})
            </h4>
            <div className="space-y-2 pr-2">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-md bg-blue-50 text-sm flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-gray-600">
                      {format(parseISO(event.start_date), "PPP p")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteDate(event.start_date)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 text-center border rounded-md bg-gray-50">
          <CalendarIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <h4 className="text-lg font-medium text-gray-700">
            No events to preview
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Set a date and time, then enable recurrence to see a preview of your
            events.
          </p>
        </div>
      )}
      {deletedDates.size > 0 && (
        <div className="space-y-2 mt-6">
          <h4 className="text-sm font-medium text-red-600">
            Deleted Occurrences ({deletedDates.size})
          </h4>
          <div className="space-y-2 pr-2">
            {Array.from(deletedDates).map((deletedDate) => (
              <div
                key={deletedDate}
                className="p-3 border rounded-md bg-red-50 text-sm flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-red-700">
                    Deleted occurrence
                  </div>
                  <div className="text-red-600">
                    {format(parseISO(deletedDate), "PPP p")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestoreDate(deletedDate)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

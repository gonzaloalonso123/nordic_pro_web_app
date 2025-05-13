"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { MapPin, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/components/calendar/calendar";

interface EventPopupProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventPopup({ event, open, onOpenChange }: EventPopupProps) {
  if (!event) return null;

  // Format date and time
  const formatEventTime = () => {
    if (!event.start) return "";

    const startDate =
      typeof event.start === "string" ? parseISO(event.start) : event.start;
    const endDate = event.end
      ? typeof event.end === "string"
        ? parseISO(event.end)
        : event.end
      : null;

    if (event.allDay) {
      return `All day · ${format(startDate, "MMM d, yyyy")}`;
    }

    const startStr = format(startDate, "MMM d, yyyy h:mm a");
    if (!endDate) return startStr;

    // If same day
    if (format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")) {
      return `${format(startDate, "MMM d, yyyy")} · ${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;
    }

    // Different days
    return `${format(startDate, "MMM d, yyyy h:mm a")} - ${format(endDate, "MMM d, yyyy h:mm a")}`;
  };

  // Get event type badge color
  const getTypeColor = () => {
    const type = event.extendedProps?.type || "default";
    const colorMap: Record<string, string> = {
      training: "bg-green-100 text-green-800",
      match: "bg-blue-100 text-blue-800",
      meeting: "bg-orange-100 text-orange-800",
      social: "bg-purple-100 text-purple-800",
      default: "bg-gray-100 text-gray-800",
    };

    return colorMap[type] || colorMap.default;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Date and time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm">{formatEventTime()}</p>
            </div>
          </div>

          {/* Location if available */}
          {event.extendedProps?.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm">{event.extendedProps.location}</p>
            </div>
          )}

          {/* Event type */}
          {event.extendedProps?.type && (
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <Badge
                variant="outline"
                className={cn("text-xs", getTypeColor())}
              >
                {event.extendedProps.type}
              </Badge>
            </div>
          )}

          {/* Description if available */}
          {event.extendedProps?.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{event.extendedProps.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

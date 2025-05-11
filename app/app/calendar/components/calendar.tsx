"use client";

import { useState } from "react";
import { EventPopup } from "./event-popup";
import type { Tables } from "@/utils/database.types";
import { CalendarEvent, StyledCalendar } from "@/components/calendar/calendar";

function convertEvents(dbEvents: Tables<"events">[]): CalendarEvent[] {
  return dbEvents.map((event) => ({
    id: event.id.toString(),
    title: event.name || "Untitled Event",
    start: event.start_date || new Date(),
    end: event.end_date || undefined,
    color: getEventColor(event.type || "default"),
    extendedProps: {
      description: event.description,
      type: event.type,
    },
  }));
}

// Helper function to get color based on event type
function getEventColor(type: string): string {
  const colorMap: Record<string, string> = {
    TRAINING: "#4CAF50",
    GAME: "#2196F3",
    meeting: "#FF9800",
    social: "#9C27B0",
    default: "#607D8B",
  };

  return colorMap[type] || colorMap.default;
}

interface CalendarProps {
  events: Tables<"events">[];
  onEventClick?: (info: any) => void;
  onDateClick?: (info: any) => void;
  className?: string;
  initialView?: "dayGridMonth" | "timeGridWeek";
}

export default function Calendar({
  events,
  onEventClick,
  onDateClick,
  className,
  initialView = "dayGridMonth",
}: CalendarProps) {
  const calendarEvents = convertEvents(events);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleEventClick = (info: any) => {
    const eventData: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      allDay: info.event.allDay,
      extendedProps: info.event.extendedProps,
    };

    setSelectedEvent(eventData);
    setIsPopupOpen(true);
  };

  const handleDateClick = (info: any) => {
    if (onDateClick) {
      onDateClick(info);
    }
  };

  return (
    <>
      <StyledCalendar
        events={calendarEvents}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        className={className}
        initialView={initialView}
      />

      <EventPopup
        event={selectedEvent}
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
      />
    </>
  );
}

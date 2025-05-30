"use client";

import { useState } from "react";
import type { Tables } from "@/types/database.types";
import { CalendarEvent, StyledCalendar } from "@/components/calendar/calendar";
import { EnhancedEventPopup } from "./event-popup";

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
  events: Tables<"events">[] | any[];
  onEventClick?: (info: any) => void;
  onDateClick?: (info: any) => void;
  className?: string;
  initialView?: "dayGridMonth" | "timeGridWeek";
  viewChangable?: boolean;
  height?: number;
}

export default function Calendar({
  events,
  onEventClick,
  className,
  initialView = "dayGridMonth",
  viewChangable = true,
  height,
}: CalendarProps) {
  const calendarEvents = convertEvents(events);

  return (
    <StyledCalendar
      events={calendarEvents}
      onEventClick={onEventClick}
      className={className}
      initialView={initialView}
      viewChangable={viewChangable}
      height={height}
    />
  );
}

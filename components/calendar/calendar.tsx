"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "./calendar.css";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  extendedProps?: Record<string, any>;
};

interface StyledCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (info: any) => void;
  onDateClick?: (info: any) => void;
  className?: string;
  initialView?: "dayGridMonth" | "timeGridWeek";
  viewChangable?: boolean;
  height?: number;
}

export function StyledCalendar({
  events,
  onEventClick,
  onDateClick,
  className,
  initialView = "dayGridMonth",
  viewChangable,
  height,
}: StyledCalendarProps) {
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek">(
    initialView
  );
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const calendarRef = React.useRef<any>(null);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      updateTitle(calendarApi);
    }
  }, [view]);

  const updateTitle = (calendarApi: any) => {
    const viewTitle = calendarApi.view.title;
    setCurrentTitle(viewTitle);
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      updateTitle(calendarApi);
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      updateTitle(calendarApi);
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      updateTitle(calendarApi);
    }
  };

  const handleViewChange = (newView: "dayGridMonth" | "timeGridWeek") => {
    setView(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
      updateTitle(calendarApi);
    }
  };

  const handleDatesSet = (arg: any) => {
    updateTitle(arg.view.calendar);
  };

  return (
    <div className={cn("styled-calendar-container", className)}>
      <div className="calendar-header flex flex-wrap items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            aria-label="Previous"
            className="rounded-r-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            aria-label="Next"
            className="rounded-l-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="ml-2"
          >
            Today
          </Button>
        </div>

        <h2 className="text-lg font-semibold hidden md:block px-4">
          {currentTitle}
        </h2>

        {viewChangable && (
          <div className="flex items-center">
            <div className="view-switcher flex rounded-md overflow-hidden border">
              <Button
                variant={view === "dayGridMonth" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewChange("dayGridMonth")}
                className="rounded-none"
              >
                Month
              </Button>
              <Button
                variant={view === "timeGridWeek" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewChange("timeGridWeek")}
                className="rounded-none"
              >
                Week
              </Button>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4 px-4 md:hidden">
        {currentTitle}
      </h2>

      <div className="calendar-wrapper rounded-lg border overflow-hidden shadow-xs">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false}
          events={events}
          eventClick={onEventClick}
          dateClick={onDateClick}
          datesSet={handleDatesSet}
          height={height || "auto"}
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          allDaySlot={true}
          allDayText="All day"
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
        />
      </div>
    </div>
  );
}

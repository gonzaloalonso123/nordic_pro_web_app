"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the CSS for styling
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
}

export function StyledCalendar({
  events,
  onEventClick,
  onDateClick,
  className,
  initialView = "dayGridMonth",
}: StyledCalendarProps) {
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek">(
    initialView
  );
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const calendarRef = React.useRef<any>(null);

  // Update the title when the view changes
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
      <div className="calendar-header flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            aria-label="Next"
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
      </div>

      {/* Mobile title - shown only on small screens */}
      <h2 className="text-lg font-semibold mb-4 px-4 md:hidden">{currentTitle}</h2>

      <div className="calendar-wrapper rounded-lg border overflow-hidden shadow-sm">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false} // We're using our custom header
          events={events}
          eventClick={onEventClick}
          dateClick={onDateClick}
          datesSet={handleDatesSet}
          height="auto"
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

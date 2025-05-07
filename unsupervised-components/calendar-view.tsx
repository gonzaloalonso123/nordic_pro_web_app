"use client";

import { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

// Generate calendar data
const generateCalendarData = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarGrid = [];
  let dayCounter = 1;

  for (let week = 0; week < 6; week++) {
    const weekDays = [];

    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < startingDayOfWeek) {
        // Empty cells before the first day of the month
        weekDays.push({ day: null, isToday: false, events: [] });
      } else if (dayCounter > daysInMonth) {
        // Empty cells after the last day of the month
        weekDays.push({ day: null, isToday: false, events: [] });
      } else {
        // Regular day cells
        const isToday = dayCounter === today.getDate();

        // Add some sample events
        const events = [];

        // Team practice on Mondays and Wednesdays
        if ((dayCounter % 7 === 1 || dayCounter % 7 === 3) && dayCounter < 28) {
          events.push({
            id: `practice-${dayCounter}`,
            title: "Team Practice",
            time: "4:00 PM - 5:30 PM",
            type: "practice",
          });
        }

        // Games on weekends
        if (dayCounter === 6 || dayCounter === 20) {
          events.push({
            id: `game-${dayCounter}`,
            title: dayCounter === 6 ? "Game vs Eagles" : "Game vs Hawks",
            time: "2:00 PM - 4:00 PM",
            type: "game",
          });
        }

        // Team meeting
        if (dayCounter === 12) {
          events.push({
            id: "meeting-1",
            title: "Team Meeting",
            time: "6:00 PM - 7:00 PM",
            type: "meeting",
          });
        }

        // Skills training
        if (dayCounter === 15) {
          events.push({
            id: "training-1",
            title: "Skills Training",
            time: "4:00 PM - 5:30 PM",
            type: "practice",
          });
        }

        weekDays.push({ day: dayCounter, isToday, events });
        dayCounter++;
      }
    }

    calendarGrid.push(weekDays);

    // Stop if we've gone through all days of the month
    if (dayCounter > daysInMonth) break;
  }

  return calendarGrid;
};

// Generate week view data
const generateWeekData = (startDate = new Date()) => {
  const start = startOfWeek(startDate, { weekStartsOn: 0 });
  const end = endOfWeek(startDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const isToday = isSameDay(day, new Date());

    // Generate events for this day
    const events = [];
    const dayOfWeek = day.getDay();

    // Team practice on Mondays and Wednesdays
    if (dayOfWeek === 1 || dayOfWeek === 3) {
      events.push({
        id: `practice-${format(day, "yyyy-MM-dd")}`,
        title: "Team Practice",
        startTime: "16:00",
        endTime: "17:30",
        type: "practice",
      });
    }

    // Games on weekends
    if (dayOfWeek === 6) {
      events.push({
        id: `game-${format(day, "yyyy-MM-dd")}`,
        title: "Game vs Eagles",
        startTime: "14:00",
        endTime: "16:00",
        type: "game",
      });
    }

    // Add a meeting on Tuesday
    if (dayOfWeek === 2) {
      events.push({
        id: `meeting-${format(day, "yyyy-MM-dd")}`,
        title: "Team Meeting",
        startTime: "18:00",
        endTime: "19:00",
        type: "meeting",
      });
    }

    return { date: day, isToday, events };
  });
};

// Generate day view data
const generateDayData = (date = new Date()) => {
  const hours = [];
  const isToday = isSameDay(date, new Date());

  // Generate hours from 8 AM to 8 PM
  for (let i = 8; i <= 20; i++) {
    const events = [];

    // Add events based on the day and hour
    const dayOfWeek = date.getDay();

    // Team practice on Mondays and Wednesdays at 4 PM
    if ((dayOfWeek === 1 || dayOfWeek === 3) && i === 16) {
      events.push({
        id: `practice-${format(date, "yyyy-MM-dd")}`,
        title: "Team Practice",
        startTime: "16:00",
        endTime: "17:30",
        duration: 90, // minutes
        type: "practice",
      });
    }

    // Games on Saturdays at 2 PM
    if (dayOfWeek === 6 && i === 14) {
      events.push({
        id: `game-${format(date, "yyyy-MM-dd")}`,
        title: "Game vs Eagles",
        startTime: "14:00",
        endTime: "16:00",
        duration: 120, // minutes
        type: "game",
      });
    }

    // Add a meeting on Tuesdays at 6 PM
    if (dayOfWeek === 2 && i === 18) {
      events.push({
        id: `meeting-${format(date, "yyyy-MM-dd")}`,
        title: "Team Meeting",
        startTime: "18:00",
        endTime: "19:00",
        duration: 60, // minutes
        type: "meeting",
      });
    }

    hours.push({
      hour: i,
      time: i > 12 ? `${i - 12}:00 PM` : `${i}:00 AM`,
      events,
    });
  }

  return { date, isToday, hours };
};

// Generate list view data
const generateListData = (days = 14) => {
  const events = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const dayOfWeek = date.getDay();

    // Team practice on Mondays and Wednesdays
    if (dayOfWeek === 1 || dayOfWeek === 3) {
      events.push({
        id: `practice-${format(date, "yyyy-MM-dd")}`,
        title: "Team Practice",
        date,
        startTime: "16:00",
        endTime: "17:30",
        type: "practice",
      });
    }

    // Games on Saturdays
    if (dayOfWeek === 6) {
      events.push({
        id: `game-${format(date, "yyyy-MM-dd")}`,
        title: `Game vs ${i % 2 === 0 ? "Eagles" : "Hawks"}`,
        date,
        startTime: "14:00",
        endTime: "16:00",
        type: "game",
      });
    }

    // Add a meeting on Tuesdays
    if (dayOfWeek === 2) {
      events.push({
        id: `meeting-${format(date, "yyyy-MM-dd")}`,
        title: "Team Meeting",
        date,
        startTime: "18:00",
        endTime: "19:00",
        type: "meeting",
      });
    }
  }

  // Sort events by date and time
  events.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  return events;
};

const calendarData = generateCalendarData();
const weekData = generateWeekData();
const dayData = generateDayData();
const listData = generateListData();

export default function CalendarView({ view = "month" }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const shortWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const isMobile = useIsMobile();

  // Month View
  const renderMonthView = () => {
    return (
      <div className="border rounded-md overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {(isMobile ? shortWeekdays : weekdays).map((day, index) => (
            <div
              key={index}
              className="py-1 md:py-2 text-center text-xs md:text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-16rem)] md:h-[500px]">
          {calendarData.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`border-b border-r p-0.5 md:p-1 ${
                  day.isToday
                    ? "bg-primary/5"
                    : day.day
                      ? "bg-background"
                      : "bg-gray-50"
                } ${weekIndex === 5 ? "border-b-0" : ""} ${dayIndex === 6 ? "border-r-0" : ""}`}
              >
                {day.day && (
                  <>
                    <div
                      className={`text-xs md:text-sm font-medium h-5 w-5 md:h-6 md:w-6 flex items-center justify-center rounded-full mb-0.5 md:mb-1 ${
                        day.isToday ? "bg-primary text-white" : ""
                      }`}
                    >
                      {day.day}
                    </div>
                    <div className="space-y-0.5 max-h-[40px] md:max-h-[80px] overflow-y-auto">
                      {day.events.map((event) => (
                        <div
                          key={event.id}
                          className={`text-[8px] md:text-xs p-0.5 md:p-1 rounded truncate ${
                            event.type === "practice"
                              ? "bg-green/10 text-green"
                              : event.type === "game"
                                ? "bg-accent/10 text-accent"
                                : "bg-primary/10 text-primary"
                          }`}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          {!isMobile && (
                            <div className="text-[8px] md:text-[10px] truncate">
                              {event.time}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Week View
  const renderWeekView = () => {
    return (
      <div className="border rounded-md overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekData.map((day, index) => (
            <div
              key={index}
              className={`py-1 md:py-3 text-center ${day.isToday ? "bg-primary/5" : ""}`}
            >
              <div className="text-xs md:text-sm font-medium text-gray-500">
                {format(day.date, isMobile ? "E" : "EEE")}
              </div>
              <div
                className={`text-sm md:text-lg font-medium mt-0.5 md:mt-1 h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center mx-auto ${
                  day.isToday ? "bg-primary text-white" : ""
                }`}
              >
                {format(day.date, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-7 h-[calc(100vh-16rem)] md:h-[500px] overflow-y-auto">
          {weekData.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`border-r min-h-full ${dayIndex === 6 ? "border-r-0" : ""} ${
                day.isToday ? "bg-primary/5" : ""
              }`}
            >
              <div className="p-0.5 md:p-1 space-y-1 md:space-y-2">
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    className={`text-[8px] md:text-xs p-1 md:p-2 rounded ${
                      event.type === "practice"
                        ? "bg-green/10 text-green"
                        : event.type === "game"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-[6px] md:text-[10px] mt-0.5 md:mt-1 truncate">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Day View
  const renderDayView = () => {
    return (
      <div className="border rounded-md overflow-hidden">
        {/* Day header */}
        <div className="bg-gray-50 border-b p-2 md:p-3 text-center">
          <div className="text-xs md:text-sm font-medium text-gray-500">
            {format(dayData.date, "EEEE")}
          </div>
          <div
            className={`text-base md:text-lg font-medium mt-0.5 md:mt-1 h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center mx-auto ${
              dayData.isToday ? "bg-primary text-white" : ""
            }`}
          >
            {format(dayData.date, "d")}
          </div>
        </div>

        {/* Day schedule */}
        <div className="overflow-y-auto h-[calc(100vh-16rem)] md:h-[500px]">
          {dayData.hours.map((hourData, index) => (
            <div key={index} className="flex border-b last:border-b-0">
              {/* Time column */}
              <div className="w-12 md:w-20 p-1 md:p-2 text-[10px] md:text-xs text-gray-500 text-right border-r">
                {hourData.time}
              </div>

              {/* Events column */}
              <div className="flex-grow p-0.5 md:p-1 relative min-h-[50px] md:min-h-[60px]">
                {hourData.events.map((event) => (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 p-1 md:p-2 rounded text-[8px] md:text-xs ${
                      event.type === "practice"
                        ? "bg-green/10 text-green"
                        : event.type === "game"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                    }`}
                    style={{
                      top: "0",
                      height: `${(event.duration / 60) * (isMobile ? 50 : 60)}px`,
                    }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-[6px] md:text-[10px] mt-0.5 truncate">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // List View
  const renderListView = () => {
    // Group events by date
    const groupedEvents = listData.reduce((groups, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: event.date,
          events: [],
        };
      }
      groups[dateKey].events.push(event);
      return groups;
    }, {});

    return (
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-y-auto h-[calc(100vh-16rem)] md:h-[500px]">
          {Object.values(groupedEvents).map((group, groupIndex) => (
            <div key={groupIndex} className="border-b last:border-b-0">
              {/* Date header */}
              <div className="bg-gray-50 p-2 md:p-3 sticky top-0">
                <div className="text-xs md:text-sm font-medium">
                  {format(
                    group.date,
                    isMobile ? "EEE, MMM d" : "EEEE, MMMM d, yyyy"
                  )}
                </div>
                {isSameDay(group.date, new Date()) && (
                  <div className="text-[10px] md:text-xs text-primary font-medium mt-0.5 md:mt-1">
                    Today
                  </div>
                )}
              </div>

              {/* Events list */}
              <div className="divide-y">
                {group.events.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 md:p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs md:text-sm font-medium truncate">
                          {event.title}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <div
                        className={`text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                          event.type === "practice"
                            ? "bg-green/10 text-green"
                            : event.type === "game"
                              ? "bg-accent/10 text-accent"
                              : "bg-primary/10 text-primary"
                        }`}
                      >
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the appropriate view
  const renderView = () => {
    switch (view) {
      case "week":
        return renderWeekView();
      case "day":
        return renderDayView();
      case "list":
        return renderListView();
      default:
        return renderMonthView();
    }
  };

  return <div>{renderView()}</div>;
}

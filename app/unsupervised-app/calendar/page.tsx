"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CalendarView from "@/unsupervised-components/calendar-view";
import UpcomingEvents from "@/unsupervised-components/upcoming-events";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarPage() {
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  // Add state for the calendar view
  const [view, setView] = useState("month");
  const isMobile = useIsMobile();

  // Default to day view on mobile
  useState(() => {
    if (isMobile) {
      setView("day");
    }
  }, [isMobile]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold font-montserrat">Calendar</h1>
          <p className="text-gray-500">Manage your team schedule and events</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Filter</span>
          </Button>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Export</span>
          </Button>
          <Button
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1 ml-auto md:ml-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="p-3 md:p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-base md:text-lg font-bold whitespace-nowrap">
                      {currentMonth} {currentYear}
                    </h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    Today
                  </Button>
                </div>

                <Tabs value={view} onValueChange={setView} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 h-8">
                    <TabsTrigger value="month" className="text-xs">
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="week" className="text-xs">
                      Week
                    </TabsTrigger>
                    <TabsTrigger value="day" className="text-xs">
                      Day
                    </TabsTrigger>
                    <TabsTrigger value="list" className="text-xs">
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CalendarView view={view} />
            </CardContent>
          </Card>
        </div>

        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingEvents />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile upcoming events (shown below calendar) */}
      <div className="mt-4 lg:hidden">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <UpcomingEvents />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

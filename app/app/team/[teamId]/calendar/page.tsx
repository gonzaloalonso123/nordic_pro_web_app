"use client";

import { useState } from "react";
import Calendar from "../../../../../components/calendar/event-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/custom/tabs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Content } from "@/components/content";
import { useClientData } from "@/utils/data/client";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { PlusCircle, CalendarIcon, Table } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUrl } from "@/hooks/use-url";
import { useHeader } from "@/hooks/useHeader";
import { TrainingSessionsTable } from "./components/table-view";
import { LoadingLink } from "@/components/ui/loading-link";

export default function CalendarDemo() {
  const [selectedView, setSelectedView] = useState<
    "dayGridMonth" | "timeGridWeek"
  >("dayGridMonth");
  const [activeTab, setActiveTab] = useState("calendar");

  const { user } = useCurrentUser();
  const { team } = useRole();
  const path = useUrl();
  const clientData = useClientData();
  const userId = user?.id;
  const router = useRouter();

  const isCoach = team.role === "COACH";

  const { useHeaderConfig } = useHeader();

  useHeaderConfig({
    centerContent: "Events",
    rightContent: (
      <LoadingLink variant="default" href={`${path}/calendar/add-event`} >
        <PlusCircle className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Add event</span>
        <span className="sm:hidden">Add</span>
      </LoadingLink>
    ),
  });

  const eventsQuery = isCoach
    ? clientData.events.useByTeam(team.id)
    : clientData.events.useByUserId(userId);
  const events = eventsQuery.data || [];

  const handleEventClick = (info: any) => {
    router.push(`${path}/calendar/${info.event.id}`);
  };

  if (!isCoach) {
    return (
      <Content>
        <Card>
          <CardContent className="p-0">
            <Calendar
              events={events || []}
              onEventClick={handleEventClick}
              initialView={selectedView}
            />
          </CardContent>
        </Card>
      </Content>
    );
  }

  return (
    <Content>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto mb-6">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar View</span>
            <span className="sm:hidden">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            <span className="hidden sm:inline">Table View</span>
            <span className="sm:hidden">Table</span>
          </TabsTrigger>
        </TabsList>
        <Card>
          <TabsContent value="calendar" className="mt-0">
            <Calendar
              events={events || []}
              onEventClick={handleEventClick}
              initialView={selectedView}
            />
          </TabsContent>

          <TabsContent value="table" className="mt-0 p-6">
            <TrainingSessionsTable
              events={events || []}
              onEventClick={handleEventClick}
              isLoading={eventsQuery.isLoading}
            />
          </TabsContent>
        </Card>
      </Tabs>
    </Content>
  );
}

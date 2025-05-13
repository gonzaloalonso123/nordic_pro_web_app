"use client";

import { useEffect, useState } from "react";
import Calendar from "./components/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Content } from "@/components/content";
import { useClientData } from "@/utils/data/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvitationList from "./components/invitation-list";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarDemo() {
  const [selectedView, setSelectedView] = useState<
    "dayGridMonth" | "timeGridWeek"
  >("dayGridMonth");
  const [activeTab, setActiveTab] = useState<"calendar" | "invitations">(
    "calendar"
  );
  const isMobile = useIsMobile();

  const handleEventClick = (info: any) => {
    alert(
      `Event: ${info.event.title}\nTime: ${info.event.start.toLocaleString()}`
    );
  };

  const { user } = useCurrentUser();
  const clientData = useClientData();
  const userId = user?.id;
  const eventsQuery = clientData.events.useByUserId(userId);
  const invitationsQuery = clientData.eventsInvitation.useByUser(userId);
  const updateInvitation = clientData.eventsInvitation.useUpdate();

  const events = eventsQuery.data || [];
  const invitations = invitationsQuery.data || [];

  const pendingInvitations =
    invitations?.filter((invitation) => invitation.will_attend === null) || [];

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await updateInvitation.mutateAsync({
        invitationId,
        updates: {
          will_attend: true,
          reason: null,
        },
      });
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleRejectInvitation = async (
    invitationId: string,
    reason: string
  ) => {
    try {
      await updateInvitation.mutateAsync({
        invitationId,
        updates: {
          will_attend: false,
          reason,
        },
      });
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  };

  useEffect(() => {
    if (pendingInvitations.length > 0) {
      setActiveTab("invitations");
    } else {
      setActiveTab("calendar");
    }
  }, [pendingInvitations.length]);

  if (!isMobile) {
    return (
      <Content>
        <h1 className="text-2xl font-bold mb-6">Team Calendar</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Calendar
                  events={events || []}
                  onEventClick={handleEventClick}
                  initialView={selectedView}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <InvitationList
              invitations={invitations || []}
              events={events || []}
              onAccept={handleAcceptInvitation}
              onReject={handleRejectInvitation}
            />
          </div>
        </div>
      </Content>
    );
  }

  return (
    <Content>
      <h1 className="text-2xl font-bold mb-6">Team Calendar</h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "calendar" | "invitations")
        }
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="invitations" className="relative">
            Invitations
            {pendingInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingInvitations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Calendar
                events={events || []}
                onEventClick={handleEventClick}
                initialView={selectedView}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invitations" className="mt-0">
          <InvitationList
            invitations={invitations || []}
            events={events || []}
            onAccept={handleAcceptInvitation}
            onReject={handleRejectInvitation}
          />
        </TabsContent>
      </Tabs>
    </Content>
  );
}

"use client";

import { useState } from "react";
import Calendar from "../../../../../components/calendar/event-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Content } from "@/components/content";
import { useClientData } from "@/utils/data/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUrl } from "@/hooks/use-url";
import { EnhancedEventPopup } from "@/components/calendar/event-popup";
import { useHeader } from "@/hooks/useHeader";

export default function CalendarDemo() {
  const [selectedView, setSelectedView] = useState< "dayGridMonth" | "timeGridWeek">("dayGridMonth");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);
  const { useHeaderConfig } = useHeader();

  useHeaderConfig({ centerContent: "Team Calendar" });

  const { user } = useCurrentUser();
  const { team } = useRole();
  const path = useUrl();
  const clientData = useClientData();
  const userId = user?.id;
  const eventsQuery = clientData.events.useByUserId(userId);
  const invitationsQuery = clientData.eventsInvitation.useByUser(userId);
  const updateInvitation = clientData.eventsInvitation.useUpdate();
  const router = useRouter();

  const events = eventsQuery.data || [];
  const invitations = invitationsQuery.data || [];

  const handleEventClick = (info: any) => {
    const eventData = events.find((event) => event.id === info.event.id);
    if (eventData) {
      const userInvitation = invitations.find(
        (inv) => inv.event_id === eventData.id
      );
      const enrichedEvent = {
        ...eventData,
        userInvitation: userInvitation
          ? {
            id: userInvitation.id,
            will_attend: userInvitation.will_attend,
            reason: userInvitation.reason,
          }
          : undefined,
      };

      setSelectedEvent(enrichedEvent);
      setIsEventPopupOpen(true);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await updateInvitation.mutateAsync({
        invitationId,
        updates: {
          will_attend: true,
          reason: null,
        },
      });
      if (selectedEvent?.userInvitation?.id === invitationId) {
        setSelectedEvent({
          ...selectedEvent,
          userInvitation: {
            ...selectedEvent.userInvitation,
            will_attend: true,
            reason: null,
          },
        });
      }
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
      if (selectedEvent?.userInvitation?.id === invitationId) {
        setSelectedEvent({
          ...selectedEvent,
          userInvitation: {
            ...selectedEvent.userInvitation,
            will_attend: false,
            reason,
          },
        });
      }
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  };

  const isMobile = useIsMobile();

  return (
    <Content>
      <div className="flex justify-between items-center mb-6">
        {team.role === "COACH" && (
          <Button
            onClick={() => {
              router.push(`${path}/calendar/add-event`);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Calendar
            events={events || []}
            onEventClick={handleEventClick}
            initialView={selectedView}
          />
        </CardContent>
      </Card>

      <EnhancedEventPopup
        event={selectedEvent}
        open={isEventPopupOpen}
        onOpenChange={setIsEventPopupOpen}
        onAcceptInvitation={handleAcceptInvitation}
        onRejectInvitation={handleRejectInvitation}
      />
    </Content>
  );
}

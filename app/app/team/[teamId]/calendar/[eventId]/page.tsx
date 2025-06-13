"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/custom/tabs";
import { format, parseISO } from "date-fns";
import { MapPin, Clock, Calendar, Users, MessageSquare, Navigation, Map, UserPlus, Trash } from "lucide-react";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { AddInvitationsModal } from "@/components/calendar/add-invitations-modal";
import { EventInvitations } from "@/components/calendar/event-invitations";
import { useClientData } from "@/utils/data/client";
import { LocationMap } from "@/components/calendar/location-map";
import { useParams, useRouter } from "next/navigation";
import { useHeader } from "@/hooks/useHeader";
import { Content } from "@/components/content";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { InvitationResponse } from "../components/invitation-reponse";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventDetailsContentProps {
  event: any;
  invitation: any;
  isCoach: boolean;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  updateInvitation: any;
  date: string;
  time: string;
  timeTocome: string | null;
  openInMaps: () => void;
  deleteEvent: () => void;
}

const EventDetailsContent = ({
  event,
  invitation,
  isCoach,
  showMap,
  setShowMap,
  updateInvitation,
  date,
  time,
  timeTocome,
  openInMaps,
  deleteEvent,
}: EventDetailsContentProps) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">{date}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      </div>

      {timeTocome && (
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm">
              <span className="font-medium">Arrive by:</span> {timeTocome}
            </p>
          </div>
        </div>
      )}
    </div>

    {event.locations && (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">{event.locations.name}</p>
            {event.locations.coordinates && (
              <div className="flex gap-3">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setShowMap(!showMap)}
                >
                  <Map className="h-4 w-4 mr-1.5" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  onClick={openInMaps}
                >
                  <Navigation className="h-4 w-4 mr-1.5" />
                  Directions
                </Button>
              </div>
            )}
          </div>
        </div>

        {showMap && event.locations.coordinates && (
          <div className="ml-8">
            <LocationMap
              coordinates={event.locations.coordinates}
              locationName={event.locations.name}
              className="w-full"
            />
          </div>
        )}
      </div>
    )}

    {event.description && (
      <>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Description</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed ml-7">{event.description}</p>
        </div>
      </>
    )}

    {!isCoach && invitation && (
      <>
        <Separator />
        <InvitationResponse invitation={invitation} updateInvitation={updateInvitation} />
      </>
    )}

    {isCoach && (
      <Button
        variant="outline"
        size="sm"
        onClick={deleteEvent}
        className="flex items-center gap-2 text-destructive hover:text-destructive"
      >
        <Trash className="h-4 w-4" />
        Delete Event
      </Button>
    )}
  </div>
);

export default function Page() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { data: event, isPending, isError } = useClientData().events.useById(eventId);
  const [showMap, setShowMap] = useState(false);
  const [showAddInvitations, setShowAddInvitations] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { user } = useCurrentUser();
  const { data: invitation } = useClientData().eventsInvitation.useByEventAndUser(eventId, user?.id);
  const updateInvitation = useClientData().eventsInvitation.useUpdate();
  const deleteEvent = useClientData().events.useDelete();
  const { team } = useRole();
  const isCoach = team?.role === "COACH";
  const { useHeaderConfig } = useHeader();
  const router = useRouter();

  useHeaderConfig({
    centerContent: event?.name || "Event Details",
    leftContent: "back"
  });

  if (isPending || isError) return null;

  const formatEventDateTime = () => {
    const startDate = parseISO(event.start_date);
    const endDate = parseISO(event.end_date);

    const startStr = format(startDate, "MMM d, yyyy");
    const startTime = format(startDate, "h:mm a");
    const endTime = format(endDate, "h:mm a");

    if (format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")) {
      return {
        date: startStr,
        time: `${startTime} - ${endTime}`,
      };
    }

    return {
      date: `${startStr} - ${format(endDate, "MMM d, yyyy")}`,
      time: `${startTime} - ${endTime}`,
    };
  };

  const formatTimeTocome = () => {
    if (!event.time_to_come) return null;
    const timeTocome = parseISO(event.time_to_come);
    return format(timeTocome, "h:mm a");
  };

  const openInMaps = () => {
    if (event.locations?.coordinates) {
      const [lat, lng] = event.locations.coordinates.split(" ");
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  const handleInvitationsAdded = () => {
    setShowAddInvitations(false);
  };
  const handleDeleteEvent = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  const { date, time } = formatEventDateTime();
  const timeTocome = formatTimeTocome();

  return (
    <Content>
      {isCoach ? (
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          <Card className="p-4">
            <TabsContent value="details" className="mt-6">
              <EventDetailsContent
                event={event}
                invitation={invitation}
                isCoach={isCoach}
                showMap={showMap}
                setShowMap={setShowMap}
                updateInvitation={updateInvitation}
                date={date}
                time={time}
                timeTocome={timeTocome}
                openInMaps={openInMaps}
                deleteEvent={handleDeleteEvent}
              />
            </TabsContent>
            <TabsContent value="invitations" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Event Invitations</span>
                  </div>
                  <Button size="sm" onClick={() => setShowAddInvitations(true)} className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Invitations
                  </Button>
                </div>
                <EventInvitations eventId={event.id} />
              </div>
            </TabsContent>
          </Card>
        </Tabs>
      ) : (
        <Card className="p-4">
          <EventDetailsContent
            event={event}
            invitation={invitation}
            isCoach={isCoach}
            showMap={showMap}
            setShowMap={setShowMap}
            updateInvitation={updateInvitation}
            date={date}
            time={time}
            timeTocome={timeTocome}
            openInMaps={openInMaps}
            deleteEvent={handleDeleteEvent}
          />
        </Card>
      )}

      <AddInvitationsModal
        open={showAddInvitations}
        onOpenChange={setShowAddInvitations}
        event={event}
        eventDescription={event.description ?? ""}
        teamId={team.id}
        onInvitationsAdded={handleInvitationsAdded}
      />
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove all invitations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Content>
  );
}

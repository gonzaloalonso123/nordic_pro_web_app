"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom/tabs";
import { format, parseISO } from "date-fns";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Check,
  X,
  MessageSquare,
  Navigation,
  Map,
  UserPlus,
  ChevronLeft,
} from "lucide-react";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { AddInvitationsModal } from "@/components/calendar/add-invitations-modal";
import { EventInvitations } from "@/components/calendar/event-invitations";
import { useClientData } from "@/utils/data/client";
import { LocationMap } from "@/components/calendar/location-map";
import { useParams } from "next/navigation";
import { useHeader } from "@/hooks/useHeader";
import { Content } from "@/components/content";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface EventDetailsContentProps {
  event: any;
  invitation: any;
  isCoach: boolean;
  showRejectReason: boolean;
  rejectReason: string;
  showMap: boolean;
  setShowRejectReason: (show: boolean) => void;
  setRejectReason: (reason: string) => void;
  setShowMap: (show: boolean) => void;
  handleAccept: () => void;
  handleReject: () => void;
  updateInvitation: any;
  date: string;
  time: string;
  timeTocome: string | null;
  openInMaps: () => void;
}

const EventDetailsContent = ({
  event,
  invitation,
  isCoach,
  showRejectReason,
  rejectReason,
  showMap,
  setShowRejectReason,
  setRejectReason,
  setShowMap,
  handleAccept,
  handleReject,
  updateInvitation,
  date,
  time,
  timeTocome,
  openInMaps,
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
          <p className="text-sm text-muted-foreground leading-relaxed ml-7">
            {event.description}
          </p>
        </div>
      </>
    )}

    {!isCoach && invitation && (
      <>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Your Response</span>
          </div>

          <div className="ml-7">
            {invitation.will_attend === null && !showRejectReason && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectReason(true)}
                  className="flex-1 text-sm"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Can't Attend
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1 text-sm"
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  Will Attend
                </Button>
              </div>
            )}

            {showRejectReason && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Let them know why you can't make it (optional)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="text-sm"
                  rows={2}
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRejectReason(false);
                      setRejectReason("");
                    }}
                    className="flex-1 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReject}
                    className="flex-1 text-sm"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {invitation.will_attend === true && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      You're attending this event
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateInvitation.mutateAsync({
                        invitationId: invitation.id,
                        updates: {
                          will_attend: null,
                          reason: null,
                        },
                      });
                    }}
                    className="text-green-700 hover:text-green-800 hover:bg-green-100 text-xs"
                  >
                    Change Response
                  </Button>
                </div>
              </div>
            )}

            {invitation.will_attend === false && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      You can't attend this event
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateInvitation.mutateAsync({
                        invitationId: invitation.id,
                        updates: {
                          will_attend: null,
                          reason: null,
                        },
                      });
                    }}
                    className="text-red-700 hover:text-red-800 hover:bg-red-100 text-xs"
                  >
                    Change Response
                  </Button>
                </div>
                {invitation.reason && (
                  <p className="mt-2 text-sm opacity-80">
                    Reason: {invitation.reason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);

export default function Page() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const {
    data: event,
    isPending,
    isError,
  } = useClientData().events.useById(eventId);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showAddInvitations, setShowAddInvitations] = useState(false);
  const { user } = useCurrentUser();
  const { data: invitation } =
    useClientData().eventsInvitation.useByEventAndUser(eventId, user?.id);
  const updateInvitation = useClientData().eventsInvitation.useUpdate();
  const { team } = useRole();
  const isCoach = team?.role === "COACH";
  const { useHeaderConfig } = useHeader();

  useHeaderConfig({
    centerContent: event?.name || "Event Details",
    leftContent: (
      <Button
        variant="outline"
        size="sm"
        onClick={() => history.back()}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    ),
  });

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

  const handleAccept = () => {
    if (invitation?.id) {
      handleAcceptInvitation(invitation.id);
    }
  };

  const handleReject = () => {
    if (invitation?.id) {
      handleRejectInvitation(invitation.id, rejectReason);
      setShowRejectReason(false);
      setRejectReason("");
    }
  };

  const handleInvitationsAdded = () => {
    setShowAddInvitations(false);
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
                showRejectReason={showRejectReason}
                rejectReason={rejectReason}
                showMap={showMap}
                setShowRejectReason={setShowRejectReason}
                setRejectReason={setRejectReason}
                setShowMap={setShowMap}
                handleAccept={handleAccept}
                handleReject={handleReject}
                updateInvitation={updateInvitation}
                date={date}
                time={time}
                timeTocome={timeTocome}
                openInMaps={openInMaps}
              />
            </TabsContent>
            <TabsContent value="invitations" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Event Invitations
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAddInvitations(true)}
                    className="flex items-center gap-2"
                  >
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
            showRejectReason={showRejectReason}
            rejectReason={rejectReason}
            showMap={showMap}
            setShowRejectReason={setShowRejectReason}
            setRejectReason={setRejectReason}
            setShowMap={setShowMap}
            handleAccept={handleAccept}
            handleReject={handleReject}
            updateInvitation={updateInvitation}
            date={date}
            time={time}
            timeTocome={timeTocome}
            openInMaps={openInMaps}
          />
        </Card>
      )}

      <AddInvitationsModal
        open={showAddInvitations}
        onOpenChange={setShowAddInvitations}
        eventId={event.id}
        eventDescription={event.description}
        teamId={team.id}
        onInvitationsAdded={handleInvitationsAdded}
      />
    </Content>
  );
}

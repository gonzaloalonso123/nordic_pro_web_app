"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { LocationMap } from "./location-map";

interface EventData {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  time_to_come?: string;
  type: string;
  locations?: {
    name: string;
    coordinates: string;
  };
  userInvitation?: {
    id: string;
    will_attend: boolean | null;
    reason?: string;
  };
}

interface EnhancedEventPopupProps {
  event: EventData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptInvitation?: (invitationId: string) => void;
  onRejectInvitation?: (invitationId: string, reason: string) => void;
}

export function EnhancedEventPopup({
  event,
  open,
  onOpenChange,
  onAcceptInvitation,
  onRejectInvitation,
}: EnhancedEventPopupProps) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showMap, setShowMap] = useState(false);

  if (!event) return null;

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

  const getTypeStyle = () => {
    const type = event.type?.toLowerCase() || "default";
    const styleMap: Record<string, string> = {
      training: "bg-green-100 text-green-800 border-green-200",
      match: "bg-blue-100 text-blue-800 border-blue-200",
      meeting: "bg-orange-100 text-orange-800 border-orange-200",
      social: "bg-purple-100 text-purple-800 border-purple-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styleMap[type] || styleMap.default;
  };

  const openInMaps = () => {
    if (event.locations?.coordinates) {
      const [lat, lng] = event.locations.coordinates.split(" ");
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  const handleAccept = () => {
    if (event.userInvitation?.id && onAcceptInvitation) {
      onAcceptInvitation(event.userInvitation.id);
    }
  };

  const handleReject = () => {
    if (event.userInvitation?.id && onRejectInvitation) {
      onRejectInvitation(event.userInvitation.id, rejectReason);
      setShowRejectReason(false);
      setRejectReason("");
    }
  };

  const { date, time } = formatEventDateTime();
  const timeTocome = formatTimeTocome();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-h-[80vh] max-h-[100svh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-lg font-semibold leading-tight pr-2">
              {event.name}
            </DialogTitle>
            <Badge className={cn("shrink-0 text-sm", getTypeStyle())}>
              {event.type}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time Section */}
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

          {/* Location Section */}
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

          {/* Description */}
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

          {/* Attendance Section */}
          {event.userInvitation && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Your Response</span>
                </div>

                <div className="ml-7">
                  {event.userInvitation.will_attend === null &&
                    !showRejectReason && (
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

                  {event.userInvitation.will_attend === true && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          You're attending this event
                        </span>
                      </div>
                    </div>
                  )}

                  {event.userInvitation.will_attend === false && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          You can't attend this event
                        </span>
                      </div>
                      {event.userInvitation.reason && (
                        <p className="mt-2 text-sm opacity-80">
                          Reason: {event.userInvitation.reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

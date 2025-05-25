"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Tables } from "@/types/database.types";

interface InvitationListProps {
  invitations: Tables<"events_invitation">[];
  events: Tables<"events">[];
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string, reason: string) => void;
}

export default function InvitationList({
  invitations,
  events,
  onAccept,
  onReject,
}: InvitationListProps) {
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>(
    {}
  );
  const [showReasonInputs, setShowReasonInputs] = useState<
    Record<string, boolean>
  >({});

  // Find the event details for an invitation
  const getEventDetails = (eventId: string) => {
    return events?.find((event) => event.id === eventId) || null;
  };

  const handleRejectClick = (invitationId: string) => {
    setShowReasonInputs((prev) => ({
      ...prev,
      [invitationId]: true,
    }));
  };

  const handleReasonChange = (invitationId: string, reason: string) => {
    setRejectReasons((prev) => ({
      ...prev,
      [invitationId]: reason,
    }));
  };

  const handleSubmitReject = (invitationId: string) => {
    onReject(invitationId, rejectReasons[invitationId] || "");
    setShowReasonInputs((prev) => ({
      ...prev,
      [invitationId]: false,
    }));
  };

  if (invitations.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            No pending invitations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => {
        const event = getEventDetails(invitation.event_id);

        return (
          <Card key={invitation.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{event?.name || "Unknown Event"}</CardTitle>
              {event && (
                <CardDescription>
                  {formatDate(new Date(event.start_date))} -{" "}
                  {formatDate(new Date(event.end_date))}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                {event?.description ||
                  invitation.description ||
                  "No description provided"}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2 pt-0">
              {invitation.will_attend === null &&
                !showReasonInputs[invitation.id] && (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => handleRejectClick(invitation.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => onAccept(invitation.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                )}

              {showReasonInputs[invitation.id] && (
                <div className="space-y-2 w-full">
                  <Textarea
                    placeholder="Reason for declining (optional)"
                    value={rejectReasons[invitation.id] || ""}
                    onChange={(e) =>
                      handleReasonChange(invitation.id, e.target.value)
                    }
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowReasonInputs((prev) => ({
                          ...prev,
                          [invitation.id]: false,
                        }))
                      }
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSubmitReject(invitation.id)}
                      className="flex-1"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}

              {invitation.will_attend === true && (
                <div className="bg-green-50 text-green-700 p-2 rounded-md text-sm">
                  You have accepted this invitation
                </div>
              )}

              {invitation.will_attend === false && (
                <div className="bg-red-50 text-red-700 p-2 rounded-md text-sm">
                  You have declined this invitation
                  {invitation.reason && (
                    <p className="mt-1 text-xs">Reason: {invitation.reason}</p>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

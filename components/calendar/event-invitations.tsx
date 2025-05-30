"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X, Clock, Users } from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { useRole } from "@/app/app/(role-provider)/role-provider";

interface EventInvitation {
  id: string;
  event_id: string;
  user_id: string;
  description: string | null;
  will_attend: boolean | null;
  reason: string | null;
  users: {
    id: string;
    email: string;
    avatar: string | null;
    gender: string;
    address: string;
    is_admin: boolean;
    last_name: string;
    birth_date: string;
    created_at: string;
    deleted_at: string | null;
    first_name: string;
    updated_at: string;
    total_experience: number;
  };
}

interface EventInvitationsProps {
  eventId: string;
}

export function EventInvitations({ eventId }: EventInvitationsProps) {
  const { data: invitations, isLoading } =
    useClientData().eventsInvitation.useByEvent(eventId);

  if (isLoading) {
    return (
      <div className="flex items-start justify-start py-8">
        <div className="text-sm text-muted-foreground">
          Loading invitations...
        </div>
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="flex items-start justify-start py-8">
        <div className="text-sm text-muted-foreground">
          No invitations found
        </div>
      </div>
    );
  }

  const attendingCount = invitations.filter(
    (inv: EventInvitation) => inv.will_attend === true
  ).length;
  const notAttendingCount = invitations.filter(
    (inv: EventInvitation) => inv.will_attend === false
  ).length;
  const pendingCount = invitations.filter(
    (inv: EventInvitation) => inv.will_attend === null
  ).length;

  const getStatusBadge = (willAttend: boolean | null) => {
    if (willAttend === true) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <Check className="h-3 w-3 mr-1" />
          Attending
        </Badge>
      );
    }
    if (willAttend === false) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <X className="h-3 w-3 mr-1" />
          Not Attending
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-700 border-yellow-200"
      >
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {attendingCount}
            </div>
            <div className="text-sm text-muted-foreground">Attending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {notAttendingCount}
            </div>
            <div className="text-sm text-muted-foreground">Not Attending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            All Responses ({invitations.length})
          </span>
        </div>

        <div className="space-y-3">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={invitation.users.avatar || undefined} />
                  <AvatarFallback>
                    {getUserInitials(
                      invitation.users.first_name,
                      invitation.users.last_name
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {invitation.users.first_name}{" "}
                        {invitation.users.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invitation.users.email}
                      </p>
                    </div>
                    {getStatusBadge(invitation.will_attend)}
                  </div>

                  {invitation.reason && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Reason:
                      </p>
                      <p className="text-sm">{invitation.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

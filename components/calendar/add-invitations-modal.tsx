"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useClientData } from "@/utils/data/client";
import { Users, UserPlus } from "lucide-react";
import { useRole } from "@/app/app/(role-provider)/role-provider";

interface TeamUser {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
  };
}

interface AddInvitationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventDescription?: string;
  teamId?: string;
  onInvitationsAdded: () => void;
}

export function AddInvitationsModal({
  open,
  onOpenChange,
  eventId,
  eventDescription,
  onInvitationsAdded,
}: AddInvitationsModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { team } = useRole();
  const teamWithUsers = useClientData().teams.useWithUsers(team.id);
  const teamUsers = teamWithUsers.data?.users || [];
  const createInvitation = useClientData().eventsInvitation.useCreate();
  const sendEventsToCalendars =
    useClientData().calendars.useSendEventsToCalendars();
  const { data: existingInvitations } =
    useClientData().eventsInvitation.useByEvent(eventId);

  const existingUserIds =
    existingInvitations?.map((inv: any) => inv.user_id) || [];
  const availableUsers = teamUsers
    .filter((teamUser) => !existingUserIds.includes(teamUser.user.id))
    .filter((user) => user.role !== "COACH");

  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map((user) => user.user.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to invite",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.all(
        selectedUsers.map((userId) =>
          createInvitation.mutateAsync({
            event_id: eventId,
            user_id: userId,
            description: eventDescription || "",
          })
        )
      );
      await sendEventsToCalendars.mutateAsync({
        usersIds: selectedUsers,
        eventId: eventId,
      });

      setSelectedUsers([]);
      onInvitationsAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Invitations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {availableUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                All team members have already been invited to this event
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Select team members to invite ({availableUsers.length}{" "}
                  available)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedUsers.length === availableUsers.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {availableUsers.map((teamUser) => (
                  <Card key={teamUser.user.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedUsers.includes(teamUser.user.id)}
                        onCheckedChange={() =>
                          handleToggleUser(teamUser.user.id)
                        }
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={teamUser.user.avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(
                            teamUser.user.first_name,
                            teamUser.user.last_name
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {teamUser.user.first_name} {teamUser.user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {teamUser.user.email}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={selectedUsers.length === 0 || isSubmitting}
                >
                  {isSubmitting
                    ? "Sending..."
                    : `Send ${selectedUsers.length} Invitation${selectedUsers.length !== 1 ? "s" : ""}`}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

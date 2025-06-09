"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClientData } from "@/utils/data/client";
import { useToast } from "@/hooks/use-toast";

interface TeamUser {
  user: {
    id: string;
    name?: string;
    email: string;
  };
  role: string;
}

interface SendFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string | null;
  teamId: string;
  teamUsers?: TeamUser[];
  isLoading?: boolean;
}

export function SendFormDialog({
  open,
  onOpenChange,
  formId,
  teamId,
  teamUsers = [],
  isLoading = false,
}: SendFormDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createFormInvitation = useClientData().formInvitations.useSendToTeam();
  const createFormInvitationForUsers = useClientData().formInvitations.useSendToUsers();
  const { toast } = useToast();

  const handleSendForm = async () => {
    if (!formId || !teamId) return;

    try {
      setIsSubmitting(true);

      if (selectedUsers.length > 0) {
        await createFormInvitationForUsers.mutateAsync({
          formId,
          userIds: selectedUsers,
        });

        toast({
          title: "Success",
          description: `Form sent to ${selectedUsers.length} selected user${selectedUsers.length !== 1 ? "s" : ""} successfully`,
        });
      } else {
        await createFormInvitation.mutateAsync({
          formId,
          teamId,
        });

        toast({
          title: "Success",
          description: "Form sent to all team members successfully",
        });
      }

      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send form invitations",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    onOpenChange(false);
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSendOptionChange = (sendToAll: boolean) => {
    if (sendToAll) {
      setSelectedUsers([]);
    } else if (selectedUsers.length === 0 && teamUsers.length > 0) {
      setSelectedUsers([teamUsers[0].user.id]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Form</DialogTitle>
          <DialogDescription>Choose who should receive this form invitation.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Send to:</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="all-users"
                  name="send-option"
                  checked={selectedUsers.length === 0}
                  onChange={() => handleSendOptionChange(true)}
                  className="h-4 w-4"
                  disabled={isSubmitting || isLoading}
                />
                <label htmlFor="all-users" className="text-sm">
                  All team members ({teamUsers.length} users)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="selected-users"
                  name="send-option"
                  checked={selectedUsers.length > 0}
                  onChange={() => handleSendOptionChange(false)}
                  className="h-4 w-4"
                  disabled={isSubmitting || isLoading}
                />
                <label htmlFor="selected-users" className="text-sm">
                  Selected users
                </label>
              </div>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {teamUsers.map((teamUser) => (
                  <div key={teamUser.user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`user-${teamUser.user.id}`}
                      checked={selectedUsers.includes(teamUser.user.id)}
                      onChange={(e) => handleUserToggle(teamUser.user.id, e.target.checked)}
                      className="h-4 w-4"
                      disabled={isSubmitting || isLoading}
                    />
                    <label htmlFor={`user-${teamUser.user.id}`} className="text-sm flex-1">
                      {`${teamUser.user.first_name} ${teamUser.user.last_name}` || teamUser.user.email}
                      <span className="text-muted-foreground ml-1">({teamUser.role.toLowerCase()})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
            </div>
          )}

          {isLoading && <div className="text-sm text-muted-foreground">Loading team members...</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSendForm}
            disabled={isSubmitting || isLoading || (selectedUsers.length === 0 && teamUsers.length === 0)}
          >
            {isSubmitting
              ? "Sending..."
              : `Send Form${
                  selectedUsers.length > 0
                    ? ` to ${selectedUsers.length} user${selectedUsers.length !== 1 ? "s" : ""}`
                    : " to All"
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

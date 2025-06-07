"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Users } from "lucide-react";

interface InvitationResponseProps {
  invitation: any;
  updateInvitation: any;
}

export function InvitationResponse({ invitation, updateInvitation }: InvitationResponseProps) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleAccept = async () => {
    try {
      await updateInvitation.mutateAsync({
        invitationId: invitation.id,
        updates: {
          will_attend: true,
          reason: null,
        },
      });
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleReject = async () => {
    try {
      await updateInvitation.mutateAsync({
        invitationId: invitation.id,
        updates: {
          will_attend: false,
          reason: rejectReason,
        },
      });
      setShowRejectReason(false);
      setRejectReason("");
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  };

  const handleChangeToNotAttending = () => {
    setShowRejectReason(true);
  };

  const handleChangeToAttending = () => {
    handleAccept();
  };

  const handleCancelReject = () => {
    setShowRejectReason(false);
    setRejectReason("");
  };

  if (!invitation) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Your Response</span>
      </div>

      {/* No response yet */}
      {invitation.will_attend === null && !showRejectReason && (
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowRejectReason(true)} className="flex-1 text-sm">
            <X className="h-4 w-4 mr-1.5" />
            Can't Attend
          </Button>
          <Button size="sm" onClick={handleAccept} className="flex-1 text-sm">
            <Check className="h-4 w-4 mr-1.5" />
            Will Attend
          </Button>
        </div>
      )}

      {/* Rejecting with reason */}
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
            <Button variant="outline" size="sm" onClick={handleCancelReject} className="flex-1 text-sm">
              Cancel
            </Button>
            <Button size="sm" onClick={handleReject} className="flex-1 text-sm">
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Currently attending - green box with red button to change */}
      {invitation.will_attend === true && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">You are attending</span>
            </div>
            <Button variant="destructive" size="sm" onClick={handleChangeToNotAttending} className="text-sm">
              <X className="h-4 w-4 mr-1.5" />
              Can't Go
            </Button>
          </div>
        </div>
      )}

      {/* Currently not attending - red box with green button to change */}
      {invitation.will_attend === false && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4" />
                <span className="text-sm font-medium">You are not attending</span>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleChangeToAttending}
                className="bg-green-600 hover:bg-green-700 text-sm"
              >
                <Check className="h-4 w-4 mr-1.5" />
                I'll Go
              </Button>
            </div>
            {invitation.reason && (
              <div className="pt-2 border-t border-red-200">
                <p className="text-sm opacity-80">
                  <span className="font-medium">Reason:</span> {invitation.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

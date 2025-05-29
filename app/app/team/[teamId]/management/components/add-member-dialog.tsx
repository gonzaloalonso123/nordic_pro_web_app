"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, QrCode, ArrowLeft } from "lucide-react";
import { QRCodeGenerator } from "./qr-code-generator";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onAddWithEmail: (email: string) => void;
}

type DialogStep = "choose" | "email" | "qr";

export function AddMemberDialog({
  isOpen,
  onClose,
  teamId,
  onAddWithEmail,
}: AddMemberDialogProps) {
  const [step, setStep] = useState<DialogStep>("choose");
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setStep("choose");
    setEmail("");
    onClose();
  };

  const handleEmailSubmit = () => {
    if (email.trim()) {
      onAddWithEmail(email);
      handleClose();
    }
  };

  const renderContent = () => {
    switch (step) {
      case "choose":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Choose how you want to add a new member to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="h-16 flex-col space-y-2"
                onClick={() => setStep("email")}
              >
                <Mail className="h-6 w-6" />
                <span>With Email</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col space-y-2"
                onClick={() => setStep("qr")}
              >
                <QrCode className="h-6 w-6" />
                <span>With QR Code</span>
              </Button>
            </div>
          </>
        );

      case "email":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("choose")}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Add Member with Email</DialogTitle>
                  <DialogDescription>
                    Enter the email address to send an invitation.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="player@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleEmailSubmit} disabled={!email.trim()}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </>
        );

      case "qr":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("choose")}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Add Member with QR Code</DialogTitle>
                  <DialogDescription>
                    Show this QR code to the player to join your team.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              <QRCodeGenerator teamId={teamId} />
              <div className="flex justify-end mt-4">
                <Button onClick={handleClose}>Done</Button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">{renderContent()}</DialogContent>
    </Dialog>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useState } from "react";
import { Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveFormPopup } from "@/components/form/responsive-form-popup";
import { MobileContent } from "./mobile-content";
import { DesktopContent } from "./desktop-content";

interface TeamUserSelectorProps {
  users: Array<{
    user: {
      id: string;
      first_name: string;
      last_name: string;
      user_id: string;
    };
    role: string;
    position: string;
  }>;
  selectedUsers: string[];
  onToggleUser: (userId: string) => void;
  onSelectAll: () => void;
}

export const TeamUserSelectorPopup: React.FC<TeamUserSelectorProps> = ({
  users,
  selectedUsers,
  onToggleUser,
  onSelectAll,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "field">("list");
  const isMobile = useIsMobile();

  const handleClose = () => {
    setOpen(false);
  };

  const contentProps = {
    users,
    selectedUsers,
    onToggleUser,
    onSelectAll,
    onClose: handleClose,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Team Members</p>
            <p className="text-xs text-muted-foreground">
              {selectedUsers.length} of {users.length} members selected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ResponsiveFormPopup
            trigger={
              <Button type="button" size="sm">
                Customize
              </Button>
            }
            title="Team Member Selection"
            open={open}
            onOpenChange={setOpen}
            desktopClassName="p-0 w-full max-w-xl mx-auto flex flex-col [&>button]:hidden rounded-lg overflow-hidden"
          >
            {isMobile ? (
              <MobileContent
                {...contentProps}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
              <DesktopContent {...contentProps} />
            )}
          </ResponsiveFormPopup>
        </div>
      </div>
    </div>
  );
};

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { footballPositions } from "@/content/football-position";
import { FootballFieldVisualization } from "./football-field-visualisation";
import { Switch } from "@/components/ui/switch";

interface DesktopContentProps {
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
  onClose: () => void;
  inviteFutureMembers: boolean;
  setInviteFutureMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DesktopContent: React.FC<DesktopContentProps> = ({
  users,
  selectedUsers,
  onToggleUser,
  onSelectAll,
  onClose,
  inviteFutureMembers,
  setInviteFutureMembers,
}) => {
  const handleSelectAll = () => {
    onSelectAll();
  };

  return (
    <>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Invitees</h2>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedUsers.length === users.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
      </div>

      <div className="flex h-[400px]">
        <div className="w-1/2 border-r p-3 overflow-y-auto">
          <span className="w-full flex justify-between items-center mb-6 px-2">
            <h2 className="font-light text-sm">Invite Future Members</h2>
            <Switch
              checked={inviteFutureMembers}
              onCheckedChange={setInviteFutureMembers}
            />
          </span>
          <h3 className="font-medium mb-2 text-sm">Players</h3>
          <div className="space-y-2">
            {users.map((teamUser) => (
              <div
                key={teamUser.user.id}
                className="flex items-center p-2 rounded-md bg-blue-50 cursor-pointer"
                onClick={() => onToggleUser(teamUser.user.id)}
              >
                <div className="flex items-center w-full">
                  <div className="shrink-0 mr-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedUsers.includes(teamUser.user.id)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedUsers.includes(teamUser.user.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {teamUser.user?.first_name} {teamUser.user?.last_name}
                    </span>
                    <span className="text-gray-500 ml-1 text-xs">
                      (
                      {footballPositions.find(
                        (p) => p.value == teamUser.position
                      )?.label || teamUser.position}
                      )
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 p-3">
          <h3 className="font-medium mb-2 text-sm">Field</h3>
          <div className="h-[calc(100%-1.5rem)]">
            <FootballFieldVisualization
              users={users}
              selectedUsers={selectedUsers}
            />
          </div>
        </div>
      </div>

      <div className="p-3 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            {selectedUsers.length} of {users.length} selected
          </p>
          <Button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 h-8"
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
};

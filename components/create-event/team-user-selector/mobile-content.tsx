"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { footballPositions } from "@/content/football-position";
import { FootballFieldVisualization } from "./football-field-visualisation";
import { Switch } from "@/components/ui/switch";

interface MobileContentProps {
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
  activeTab: "list" | "field";
  setActiveTab: (tab: "list" | "field") => void;
  inviteFutureMembers: boolean;
  setInviteFutureMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileContent: React.FC<MobileContentProps> = ({
  users,
  selectedUsers,
  onToggleUser,
  onSelectAll,
  onClose,
  activeTab,
  setActiveTab,
  inviteFutureMembers,
  setInviteFutureMembers,
}) => {
  const handleSelectAll = () => {
    onSelectAll();
  };

  return (
    <>
      <div className="p-4 px-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Invitees</h2>
          </div>
          <div className="w-24 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedUsers.length === users.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-0 border rounded-md overflow-hidden">
          <button
            className={`py-3 text-center ${
              activeTab === "list"
                ? "bg-blue-100 text-blue-600 font-medium border-blue-500"
                : "bg-gray-50 text-gray-600"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Players
          </button>
          <button
            className={`py-3 text-center ${
              activeTab === "field"
                ? "bg-blue-100 text-blue-600 font-medium border-blue-500"
                : "bg-gray-50 text-gray-600"
            }`}
            onClick={() => setActiveTab("field")}
          >
            Field
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {activeTab === "list" && (
          <div className="space-y-2">
            <span className="w-full flex justify-between items-center mb-6 px-2">
              <h2 className="font-light">Invite Future Members</h2>
              <Switch
                checked={inviteFutureMembers}
                onCheckedChange={setInviteFutureMembers}
              />
            </span>
            {users.map((teamUser) => (
              <div
                key={teamUser.user.id}
                className="flex items-center p-3 rounded-md bg-blue-50 cursor-pointer"
                onClick={() => onToggleUser(teamUser.user.id)}
              >
                <div className="flex items-center w-full">
                  <div className="shrink-0 mr-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedUsers.includes(teamUser.user.id)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedUsers.includes(teamUser.user.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
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
                  <div>
                    <span className="font-medium">
                      {teamUser.user?.first_name} {teamUser.user?.last_name}
                    </span>
                    <span className="text-gray-500 ml-1">
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
        )}
        {activeTab === "field" && (
          <div className="h-full">
            <FootballFieldVisualization
              users={users}
              selectedUsers={selectedUsers}
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            {selectedUsers.length} of {users.length} selected
          </p>
          <Button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
};

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { footballPositions } from "@/content/football-position";
import { FootballFieldVisualization } from "./football-field-visualisation";
import { useState } from "react";

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

export const TeamUserSelector: React.FC<TeamUserSelectorProps> = ({
  users,
  selectedUsers,
  onToggleUser,
  onSelectAll,
}) => {
  const positionCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((teamUser) => {
      if (selectedUsers.includes(teamUser.user.id)) {
        counts[teamUser.position] = (counts[teamUser.position] || 0) + 1;
      }
    });
    return counts;
  }, [users, selectedUsers]);
  const [activeTab, setActiveTab] = useState<"list" | "field">("list");

  return (
    <div className="space-y-4 mt-6 border rounded-md p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Invite Team Members</h3>
        <Button type="button" variant="outline" size="sm" onClick={onSelectAll}>
          {selectedUsers.length === users.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Select team members to invite to this event
      </p>

      <div className="mb-2">
        <span className="font-semibold text-sm">
          {positionCounts.length > 0 ? "Selected positions:" : ""}{" "}
        </span>
        <div className="flex flex-wrap gap-2 mt-1 h-6">
          {Object.entries(positionCounts).map(([position, count]) => (
            <span
              key={position}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {footballPositions.find((p) => p.value == position)?.label ||
                position}
              <span className="ml-1 bg-primary/20 text-primary px-1 rounded">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="hidden md:flex gap-2">
        <div className="space-y-2 max-h-60 w-1/2 overflow-y-auto">
          {users.map((teamUser) => (
            <Card
              key={teamUser.user.user_id}
              className={`flex justify-between items-center p-2 rounded-md ${
                selectedUsers.includes(teamUser.user.id)
                  ? "bg-primary/10"
                  : "bg-muted/50"
              }`}
              onClick={() => onToggleUser(teamUser.user.id)}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(teamUser.user.id)}
                  onChange={() => {}}
                  className="h-4 w-4"
                />
                <span>
                  {teamUser.user?.first_name} {teamUser.user?.last_name} (
                  <span className="text-xs text-gray-500">
                    {footballPositions.find((p) => p.value == teamUser.position)
                      ?.label || teamUser.position}
                  </span>
                  )
                </span>
              </div>
            </Card>
          ))}
        </div>
        <div className="w-1/2">
          <FootballFieldVisualization
            users={users}
            selectedUsers={selectedUsers}
          />
        </div>
      </div>
      <div className="md:hidden">
        <div className="flex mb-2">
          <button
            className={`flex-1 py-2 rounded-l-md border border-primary/20 ${
              activeTab === "list"
                ? "bg-primary/10 text-primary font-semibold"
                : "bg-muted/50 text-muted-foreground"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Players
          </button>
          <button
            className={`flex-1 py-2 rounded-r-md border-t border-b border-r border-primary/20 ${
              activeTab === "field"
                ? "bg-primary/10 text-primary font-semibold"
                : "bg-muted/50 text-muted-foreground"
            }`}
            onClick={() => setActiveTab("field")}
          >
            Field
          </button>
        </div>
        {activeTab === "list" && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((teamUser) => (
              <Card
                key={teamUser.user.user_id}
                className={`flex justify-between items-center p-2 rounded-md ${
                  selectedUsers.includes(teamUser.user.id)
                    ? "bg-primary/10"
                    : "bg-muted/50"
                }`}
                onClick={() => onToggleUser(teamUser.user.id)}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(teamUser.user.id)}
                    onChange={() => {}}
                    className="h-4 w-4"
                  />
                  <span>
                    {teamUser.user?.first_name} {teamUser.user?.last_name} (
                    <span className="text-xs text-gray-500">
                      {footballPositions.find(
                        (p) => p.value == teamUser.position
                      )?.label || teamUser.position}
                    </span>
                    )
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
        {activeTab === "field" && (
          <div>
            <FootballFieldVisualization
              users={users}
              selectedUsers={selectedUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

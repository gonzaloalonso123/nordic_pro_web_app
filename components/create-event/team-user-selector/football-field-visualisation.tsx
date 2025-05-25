"use client";

import React, { useState } from "react";
import { footballPositions } from "@/content/football-position";
import { useIsMobile } from "@/hooks/use-mobile";

interface FootballFieldVisualizationProps {
  selectedUsers: string[];
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
}

export const FootballFieldVisualization: React.FC<
  FootballFieldVisualizationProps
> = ({ selectedUsers, users }) => {
  const [activePosition, setActivePosition] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Calculate position counts for selected users
  const positionCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((teamUser) => {
      if (selectedUsers.includes(teamUser.user.id)) {
        counts[teamUser.position] = (counts[teamUser.position] || 0) + 1;
      }
    });
    return counts;
  }, [users, selectedUsers]);

  // Get unique positions from the selected users
  const selectedPositions = Object.keys(positionCounts);

  // Get players for a specific position
  const getPlayersForPosition = (position: string) => {
    return users.filter(
      (user) =>
        user.position === position && selectedUsers.includes(user.user.id)
    );
  };

  // Handle position interaction based on device
  const handlePositionInteraction = (position: string) => {
    if (isMobile) {
      setActivePosition(activePosition === position ? null : position);
    }
  };

  // Get active position info
  const activePositionInfo = activePosition
    ? footballPositions.find((p) => p.value === activePosition)
    : null;

  // Get active position players
  const activePlayers = activePosition
    ? getPlayersForPosition(activePosition)
    : [];

  return (
    <div className="rounded-md w-full">
      <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
        {/* Football field */}
        <div className="absolute inset-0 bg-green-600 rounded-md overflow-hidden">
          {/* Field markings */}
          <div className="absolute inset-x-0 top-0 h-[20%] border-b-2 border-white/70"></div>
          <div className="absolute inset-x-0 bottom-0 h-[20%] border-t-2 border-white/70"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[70%] h-[70%] border-2 border-white/70 rounded-full"></div>
          </div>
          <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/70 transform -translate-y-1/2"></div>

          {/* Goal areas */}
          <div className="absolute top-0 left-1/2 w-[40%] h-[10%] border-2 border-t-0 border-white/70 transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-[40%] h-[10%] border-2 border-b-0 border-white/70 transform -translate-x-1/2"></div>

          {/* Position markers */}
          {selectedPositions.map((position) => {
            const positionInfo = footballPositions.find(
              (p) => p.value === position
            );
            if (!positionInfo || !positionInfo.fieldPosition) return null;

            const { x, y } = positionInfo.fieldPosition;
            const isActive = activePosition === position;

            return (
              <div
                key={position}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <div
                  className="relative"
                  onClick={() => handlePositionInteraction(position)}
                  onMouseEnter={() => !isMobile && setActivePosition(position)}
                  onMouseLeave={() => !isMobile && setActivePosition(null)}
                >
                  <div
                    className={`w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-md transition-all ${isActive ? "ring-4 ring-white" : ""}`}
                  >
                    <span className="font-bold text-xs">
                      {positionInfo.shortLabel ||
                        positionInfo.label.substring(0, 3)}
                    </span>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary">
                    {positionCounts[position]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-1 h-8 py-2">
          {activePlayers.map((player) => (
            <span
              key={player.user.id}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary"
            >
              {player.user.first_name} {player.user.last_name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

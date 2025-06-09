"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { type ProcessedChatRoom, useChatListData } from "@/hooks/queries/useChatListData";
import { ChatListItem } from "./chat-list-item";

function useFilteredRooms(rooms: ProcessedChatRoom[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) return rooms;

    const query = searchQuery.toLowerCase();
    return rooms.filter((room) =>
      room.displayName.toLowerCase().includes(query)
    );
  }, [rooms, searchQuery]);
}

export default function ChatList() {
  const { user } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    chatRooms,
    unreadCounts,
    isLoading,
    error,
    handleRoomClick,
  } = useChatListData(user?.id);

  const filteredRooms = useFilteredRooms(chatRooms, searchQuery);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  if (error) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-2">
            <p className="text-destructive">Failed to load chats</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b shrink-0">
        <Input
          placeholder="Search chats..."
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full"
          aria-label="Search chat rooms"
        />
      </CardHeader>

      <CardContent className="p-0 overflow-y-auto grow">
        <div className="divide-y" role="list" aria-label="Chat rooms">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grow">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <ChatListItem
                key={room.id}
                room={room}
                unreadCount={unreadCounts[room.id] || 0}
                currentUserId={user?.id || ''}
                onRoomClick={handleRoomClick}
              />
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium">
                  {searchQuery ? "No matching chats found" : "No chat rooms yet"}
                </p>
                {!searchQuery && (
                  <p className="text-sm">
                    Start a new conversation with your team
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

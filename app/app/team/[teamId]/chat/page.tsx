"use client";

import { Content } from "@/components/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, PlusSquare } from "lucide-react";
import { useState, useMemo } from "react";
import {
  useChatRoomsByUser,
  useUnreadMessageCountBatch,
} from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { NewChatModal } from "@/components/chat/new-chat-modal";
import { useUrl } from "@/hooks/use-url";

export default function ChatPage() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  const { data: chatRoomsData, isLoading: isLoadingChatRooms } =
    useChatRoomsByUser(user?.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const chatRooms = useMemo(() => chatRoomsData ?? [], [chatRoomsData]);
  const roomIds = useMemo(() => chatRooms.map((room) => room.id), [chatRooms]);

  const { data: unreadCounts = {} } = useUnreadMessageCountBatch(
    roomIds,
    user?.id
  );

  const path = useUrl();

  const filteredRooms = useMemo(
    () =>
      chatRooms.filter((room) => {
        const roomName = room.name;
        return (
          typeof roomName === "string" &&
          roomName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }),
    [chatRooms, searchQuery]
  );

  const isLoading = isLoadingUser || isLoadingChatRooms;

  return (
    <Content>
      <div className="flex flex-col h-full">
        <Card className="flex-grow flex flex-col overflow-hidden">
          <CardHeader className="px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNewChatModalOpen(true)}
                  title="Start new chat"
                  aria-label="Start new chat"
                >
                  <PlusSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-grow">
            <div className="divide-y">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))
              ) : filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const unreadCount = unreadCounts[room.id] || 0;
                  const roomName = room.name || "Unnamed Chat";

                  return (
                    <Link
                      href={`${path}/chat/${room.id}`}
                      key={room.id}
                      className="block"
                      aria-label={`Open chat with ${roomName}`}
                    >
                      <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>
                              {roomName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2) || "CH"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm truncate">
                              {roomName}
                            </h4>
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center text-xs"
                          >
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  {searchQuery
                    ? "No matching conversations found."
                    : "No conversations yet. Start a new one!"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onOpenChange={setIsNewChatModalOpen}
      />
    </Content>
  );
}

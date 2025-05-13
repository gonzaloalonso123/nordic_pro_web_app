"use client";

import { usePathname } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatRoom = pathname !== "/app/chat";
  const isMobile = useIsMobile();
  return (
    <div className="h-full">
      <div className="md:hidden h-full">{children}</div>
      <div className="hidden md:flex h-full">
        <div
          className={`w-1/3 border-r ${isChatRoom ? "block" : "hidden md:block"}`}
        >
          {!isChatRoom && children}
          {isChatRoom && <ChatListSidebar />}
        </div>
        <div className={`flex-1 ${isChatRoom ? "block" : "hidden md:block"}`}>
          {isChatRoom && children}
          {!isChatRoom && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Content } from "@/components/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";
import {
  useChatRoomsByUser,
  useUnreadMessageCountBatch,
} from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUnreadMessageCount } from "@/hooks/queries/useChatRooms";

function ChatListSidebar() {
  const { user } = useCurrentUser();
  const { data: chatRooms, isLoading } = useChatRoomsByUser(user?.id);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all room IDs for batch unread count query
  const roomIds = useMemo(
    () => chatRooms?.map((room) => room.id) || [],
    [chatRooms]
  );

  // Get unread counts for all rooms in a single query
  const { data: unreadCounts = {} } = useUnreadMessageCountBatch(
    roomIds,
    user?.id
  );

  const filteredRooms =
    chatRooms?.filter((room) =>
      room.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Conversations</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
            // Loading skeletons
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
              // Get unread count from the batch result
              const unreadCount = unreadCounts[room.id] || 0;

              return (
                <Link
                  href={`/app/chat/${room.id}`}
                  key={room.id}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={room.avatar_url}
                          alt={room.name || ""}
                        />
                        <AvatarFallback>
                          {room.name
                            ? room.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "CH"}
                        </AvatarFallback>
                      </Avatar>
                      {room.is_active && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm truncate">
                          {room.name || "Unnamed Chat"}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {room.updated_at
                            ? new Date(room.updated_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {room.last_message || "No recent messages"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="rounded-full h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchQuery
                ? "No matching chat rooms found"
                : "No chat rooms available"}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}

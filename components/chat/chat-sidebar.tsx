"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import {
  useChatRoomsByUser,
  useUnreadMessageCountBatch,
  useMarkRoomAsRead,
} from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrl } from "@/hooks/use-url";
import { LoadingLink } from "../ui/loading-link";
import { formatChatTime, formatMessagePreviewWithSender } from "@/utils/format-time";
import { cn } from "@/lib/utils";
import { useChatRoomDisplayName } from "@/hooks/useChatRoomDisplayName";
import { useChatRoomAvatar } from "@/hooks/useChatRoomAvatar";

export default function ChatListSidebar() {
  const { user } = useCurrentUser();
  const { data: chatRooms = [], isLoading } = useChatRoomsByUser(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const markRoomAsReadMutation = useMarkRoomAsRead();
  const { getRoomDisplayName } = useChatRoomDisplayName();
  const { getChatAvatarInfo } = useChatRoomAvatar();

  const path = useUrl();

  const roomIds = useMemo(() => chatRooms.map((room) => room.id), [chatRooms]);

  const { data: unreadCounts = {} } = useUnreadMessageCountBatch(roomIds, user?.id);

  // Sort rooms by latest message timestamp, with empty rooms at the bottom
  const sortedRooms = useMemo(() => {
    return chatRooms.sort((a, b) => {
      const aLastMessage = a.last_message?.[0];
      const bLastMessage = b.last_message?.[0];

      // If both have messages, sort by message timestamp (newest first)
      if (aLastMessage && bLastMessage) {
        return new Date(bLastMessage.created_at).getTime() - new Date(aLastMessage.created_at).getTime();
      }

      // If only one has messages, prioritize the one with messages
      if (aLastMessage && !bLastMessage) return -1;
      if (!aLastMessage && bLastMessage) return 1;

      // If neither has messages, sort by room creation date (newest first)
      const aTimestamp = a.updated_at || a.created_at;
      const bTimestamp = b.updated_at || b.created_at;

      if (!aTimestamp && !bTimestamp) return 0;
      if (!aTimestamp) return 1;
      if (!bTimestamp) return -1;

      return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime();
    });
  }, [chatRooms]);

  const filteredRooms = useMemo(() => {
    return sortedRooms.filter((room) => {
      const displayName = getRoomDisplayName(room);
      return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [sortedRooms, searchQuery, getRoomDisplayName]);

  const handleRoomClick = useCallback((roomId: string) => {
    if (user?.id) {
      markRoomAsReadMutation.mutate({ roomId, userId: user.id });
    }
  }, [user?.id, markRoomAsReadMutation]);



  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b shrink-0">
        <Input
          placeholder="Search chats..."
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </CardHeader>

      <CardContent className="p-0 overflow-y-auto grow">
        <div className="divide-y">
          {isLoading ? (
            Array(5)
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
            filteredRooms.map((room) => {
              const unreadCount = unreadCounts[room.id] || 0;
              const hasUnread = unreadCount > 0;
              const lastMessage = room.last_message?.[0];
              const lastMessageTime = lastMessage?.created_at || room.updated_at;
              const avatarInfo = getChatAvatarInfo(room);
              const displayName = avatarInfo.displayName;

              // Format message preview with sender name
              const messagePreview = lastMessage
                ? formatMessagePreviewWithSender(
                  lastMessage.content,
                  lastMessage.users?.first_name || null,
                  lastMessage.users?.last_name || null,
                  user?.id || '',
                  lastMessage.user_id
                )
                : "No recent messages";

              return (
                <LoadingLink
                  unstyled
                  href={`${path}/chat/${room.id}`}
                  key={room.id}
                  className="flex min-h-18 justify-center items-center"
                  onClick={() => handleRoomClick(room.id)}
                >
                  <div className={cn(
                    "flex w-full items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    hasUnread && "bg-blue-50/30 hover:bg-blue-50/50"
                  )}>
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={avatarInfo.avatarUrl || undefined}
                          alt={displayName}
                        />
                        <AvatarFallback>
                          {avatarInfo.initials}
                        </AvatarFallback>
                      </Avatar>
                      {hasUnread && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={cn(
                          "text-sm truncate",
                          hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                        )}>
                          {displayName}
                        </h4>
                        {lastMessageTime && (
                          <span className="text-xs text-gray-500 ml-2 shrink-0">
                            {formatChatTime(lastMessageTime)}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs truncate",
                        hasUnread ? "text-gray-600 font-medium" : "text-gray-500"
                      )}>
                        {messagePreview}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="rounded-full h-5 min-w-5 px-1.5 text-xs flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </div>
                </LoadingLink>
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
    </Card >
  );
}

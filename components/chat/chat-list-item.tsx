"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingLink } from "@/components/ui/loading-link";
import { useUrl } from "@/hooks/use-url";
import { formatChatTime, formatMessagePreviewWithSender } from "@/utils/format-time";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface ChatListItemProps {
  room: any;
  unreadCount: number;
  currentUserId: string;
}

export const ChatListItem = memo(function ChatListItem({
  room,
  unreadCount,
  currentUserId,
}: ChatListItemProps) {
  const path = useUrl();
  const hasUnread = unreadCount > 0;
  const lastMessage = room.lastMessage;
  const lastMessageTime = lastMessage?.createdAt || room.updatedAt;

  const messagePreview = lastMessage
    ? `${lastMessage.senderName}: ${lastMessage.content}`.slice(0, 50) +
      (`${lastMessage.senderName}: ${lastMessage.content}`.length > 50 ? '...' : '')
    : "No recent messages";

  return (
    <LoadingLink
      unstyled
      href={`${path}/chat/${room.id}`}
      className="flex min-h-18 justify-center items-center"
      role="listitem"
    >
      <div className={cn(
        "flex w-full items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors",
        hasUnread && "bg-blue-50/30 hover:bg-blue-50/50"
      )}>
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={room.avatarUrl || undefined}
              alt={room.displayName}
            />
            <AvatarFallback>
              {room.initials}
            </AvatarFallback>
          </Avatar>
          {hasUnread && (
            <span
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="grow min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className={cn(
              "text-sm truncate",
              hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"
            )}>
              {room.displayName}
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
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
    </LoadingLink>
  );
});

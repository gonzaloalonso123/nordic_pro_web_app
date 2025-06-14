"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database.types";
import { memo } from "react";
import { getInitials } from "@/utils/get-initials";

interface MessageItemProps {
  message: Tables<"messages"> & {
    users: Partial<Tables<"users">> | null;
  };
  currentUserId: string | undefined;
}

export const MessageItem = memo(function MessageItem({
  message,
  currentUserId
}: MessageItemProps) {
  const isCurrentUserMessage = message.sender_id === currentUserId;
  const senderProfile = message.users;

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Sending...";
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "p");
    }
    if (isYesterday(date)) {
      return `Yesterday ${format(date, "p")}`;
    }
    return format(date, "MMM d, yyyy p");
  };

  return (
    <div
      className={cn("flex mb-3", isCurrentUserMessage ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex items-end gap-2 max-w-[75%]", isCurrentUserMessage ? "flex-row-reverse" : "flex-row")}>
        {!isCurrentUserMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={senderProfile?.avatar || undefined}
              alt={senderProfile?.first_name || "User avatar"}
            />
            <AvatarFallback>
              {getInitials({ firstName: senderProfile?.first_name, lastName: senderProfile?.last_name })}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "p-3 rounded-lg break-words max-w-80",
            isCurrentUserMessage
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted rounded-bl-none"
          )}
        >
          {!isCurrentUserMessage && senderProfile?.first_name && (
            <p className="text-xs font-semibold mb-1 text-muted-foreground">
              {senderProfile.first_name}
            </p>
          )}
          <p className="text-sm whitespace-pre-wrap">
            {message.content}
          </p>
          <p className={cn(
            "text-xs mt-1",
            isCurrentUserMessage
              ? "text-primary-foreground/70"
              : "text-muted-foreground/70"
          )}>
            {formatTimestamp(message.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
});

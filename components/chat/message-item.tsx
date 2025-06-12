"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { type Tables } from "@/types/database.types";
import { memo } from "react";
import { ChatMessageWithDetails } from "@/utils/supabase/services";

interface MessageItemProps {
  message: ChatMessageWithDetails;
  currentUser: Tables<'users'>;
}

export const MessageItem = memo(function MessageItem({
  message,
  currentUser
}: MessageItemProps) {
  const isCurrentUserMessage = message.sender_id === currentUser.id;

  const authorName = isCurrentUserMessage
    ? "You"
    : message.author?.first_name ||
      message.author?.email?.split("@")[0] ||
      `User ${message.sender_id ? message.sender_id.substring(0, 6) : "..."}`;

  return (
    <div
      className={`flex ${isCurrentUserMessage ? "justify-end" : "justify-start"}`}
    >
      <div className="flex items-end gap-2 max-w-[75%]">
        {!isCurrentUserMessage && (
          <div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.author?.avatar || undefined} />
              <AvatarFallback>
                {getInitials({
                  firstName: message.author?.first_name,
                  lastName: message.author?.last_name
                })}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div
          className={`py-2 px-3 rounded-lg shadow-xs max-w-80 ${
            isCurrentUserMessage
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-slate-200 rounded-bl-none"
          }`}
        >
          {!isCurrentUserMessage && (
            <p className="text-xs font-semibold mb-1">
              {authorName}
            </p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <p className={`text-xs ${
            isCurrentUserMessage ? "text-muted/80" : "text-muted-foreground/80"
          } mt-1 text-right`}>
            {message.created_at
              ? new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Sending..."}
          </p>
        </div>
        {isCurrentUserMessage && (
          <div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar || undefined} />
              <AvatarFallback>
                {getInitials({
                  firstName: currentUser.first_name,
                  lastName: currentUser.last_name
                })}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
});

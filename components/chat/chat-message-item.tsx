"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/database.types";

interface ChatMessageItemProps {
  message: Tables<"messages"> & {
    users: Partial<Tables<"users">> | null;
  };
  currentUserId: string | undefined;
}

export default function ChatMessageItem({ message, currentUserId }: ChatMessageItemProps) {
  const isSender = message.sender_id === currentUserId;
  const senderProfile = message.users;

  const getAvatarFallback = (name?: string | null) => {
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "";
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
    <div className={cn("flex mb-3", isSender ? "justify-end" : "justify-start")}>
      <div className={cn("flex items-end gap-2 max-w-[75%]", isSender ? "flex-row-reverse" : "flex-row")}>
        {!isSender && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={senderProfile?.avatar || undefined} alt={senderProfile?.first_name || "User avatar"} />
            <AvatarFallback>{getAvatarFallback(senderProfile?.first_name)}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "p-3 rounded-lg break-words",
            isSender ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
          )}
        >
          {!isSender && senderProfile?.first_name && (
            <p className="text-xs font-semibold mb-1">{senderProfile.first_name}</p>
          )}
          <p className="text-sm">{message.content}</p>
          <p className={cn("text-xs mt-1", isSender ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
            {formatTimestamp(message.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

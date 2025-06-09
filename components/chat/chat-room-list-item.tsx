"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/database.types";

interface ChatRoomListItemProps {
  room: Tables<"chat_rooms"> & {
    other_participants?: (Tables<"users"> & { id: string })[];
    messages?: Tables<"messages">[];
    unread_count?: number;
  };
  isSelected: boolean;
  currentUserId: string | undefined;
  onClick: () => void;
}

export default function ChatRoomListItem({ room, isSelected, currentUserId, onClick }: ChatRoomListItemProps) {
  let displayName = room.name;
  let displayAvatarUrl: string | null | undefined = null;
  let avatarFallback = room.name?.substring(0, 1).toUpperCase() || (room.is_group_chat ? "G" : "U");

  if (!room.is_group_chat && room.other_participants && room.other_participants.length > 0) {
    const otherParticipant = room.other_participants[0];
    displayName = otherParticipant?.first_name || "Chat User";
    displayAvatarUrl = otherParticipant?.avatar;
    avatarFallback = otherParticipant?.first_name?.substring(0, 2).toUpperCase() || "CU";
  } else if (room.is_group_chat) {
    avatarFallback = room.name?.substring(0, 1).toUpperCase() || "G";
  }

  const lastMessage = room.messages && room.messages.length > 0 ? room.messages[room.messages.length - 1] : null;

  const lastMessageSender = lastMessage?.sender_id === currentUserId ? "You: " : "";
  const lastMessageContent = lastMessage?.content ? `${lastMessageSender}${lastMessage.content}` : "No messages yet";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg bg-white",
        isSelected ? "bg-muted" : ""
      )}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={displayAvatarUrl || undefined} alt={displayName || "Chat avatar"} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold truncate text-sm">{displayName}</h3>
        </div>
        <p className="text-xs text-muted-foreground truncate">{lastMessageContent}</p>
      </div>
      {room.unread_count && room.unread_count > 0 && (
        <Badge variant="default" className="h-5 px-1.5 text-xs">
          {room.unread_count > 9 ? "9+" : room.unread_count}
        </Badge>
      )}
    </button>
  );
}

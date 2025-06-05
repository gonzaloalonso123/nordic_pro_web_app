import { useCallback } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useChatRoomDisplayName } from "./useChatRoomDisplayName";
import { getInitials } from "@/utils/get-initials";

export interface ChatAvatarInfo {
  avatarUrl?: string;
  initials: string;
  displayName: string;
}

export const useChatRoomAvatar = () => {
  const { user } = useCurrentUser();
  const { getRoomDisplayName, getRoomInitials } = useChatRoomDisplayName();

  const getChatAvatarInfo = useCallback((room: any): ChatAvatarInfo => {
    if (!room) {
      return { 
        avatarUrl: undefined, 
        initials: "?", 
        displayName: "Chat" 
      };
    }
    
    // Check if this is a 1-1 chat (exactly 2 members)
    const members = room.chat_room_members || [];
    if (members.length === 2) {
      // Find the other user (not the current user)
      const otherMember = members.find((member: any) => member.user_id !== user?.id);
      if (otherMember?.users) {
        const otherUser = otherMember.users;
        return {
          avatarUrl: otherUser.avatar ?? undefined,
          initials: getInitials({
            firstName: otherUser.first_name,
            lastName: otherUser.last_name
          }),
          displayName: `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || otherUser.email?.split('@')[0] || 'Unknown User'
        };
      }
    }
    
    // For group chats or when other user info is not available, use room display name
    const displayName = getRoomDisplayName(room);
    return {
      avatarUrl: undefined,
      initials: getRoomInitials(room),
      displayName
    };
  }, [user?.id, getRoomDisplayName, getRoomInitials]);

  return { getChatAvatarInfo };
};


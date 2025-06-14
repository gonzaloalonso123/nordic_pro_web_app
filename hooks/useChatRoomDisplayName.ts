import { useCallback } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { ChatRoomWithDetails } from "@/utils/supabase/services";

export const useChatRoomDisplayName = () => {
  const { user } = useCurrentUser();

  const getRoomDisplayName = useCallback((room: ChatRoomWithDetails): string => {
    // If room has a name, use it
    if (room.name?.trim()) {
      return room.name.trim();
    }

    // Get other members (exclude current user)
    const otherMembers = room.chat_room_participants?.filter(
      (member) => member.user_id !== user?.id
    ) || [];

    if (otherMembers.length === 0) {
      return "Empty Chat";
    }

    // Format member names
    const memberNames = otherMembers.map((member) => {
      const firstName = member.users?.first_name?.trim();
      const lastName = member.users?.last_name?.trim();

      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      } else if (member.users?.email) {
        // Use part before @ symbol as fallback
        return member.users.email.split('@')[0];
      } else if (member.users?.username) {
        return member.users.username;
      } else {
        return "Unknown User";
      }
    });

    // Format display based on number of members
    if (memberNames.length === 1) {
      return memberNames[0];
    } else if (memberNames.length === 2) {
      return memberNames.join(" & ");
    } else if (memberNames.length === 3) {
      return `${memberNames[0]}, ${memberNames[1]} & ${memberNames[2]}`;
    } else {
      return `${memberNames[0]} & ${memberNames.length - 1} others`;
    }
  }, [user?.id]);

  const getRoomInitials = useCallback((room: ChatRoomWithDetails): string => {
    const displayName = getRoomDisplayName(room);

    // Split by common separators and take first letter of each part
    const words = displayName.split(/[\s&,]+/).filter(word => word.length > 0);

    if (words.length === 1) {
      // Single word - take first two characters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words - take first letter of first two words
      return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
    }
  }, [getRoomDisplayName]);

  return {
    getRoomDisplayName,
    getRoomInitials
  };
};


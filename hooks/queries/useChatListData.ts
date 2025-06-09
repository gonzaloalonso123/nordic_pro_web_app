"use client";

import { useMemo, useCallback } from "react";
import {
  useChatRoomsByUser,
  useUnreadMessageCountBatch,
  useMarkRoomAsRead,
} from "@/hooks/queries/useChatRooms";
import { useChatRoomDisplayName } from "@/hooks/useChatRoomDisplayName";
import { ChatAvatarInfo, useChatRoomAvatar } from "@/hooks/useChatRoomAvatar";
import { ChatRoomWithDetails } from "@/utils/supabase/services";

export type ProcessedChatRoom = ChatRoomWithDetails & {
  displayName: string;
  avatarInfo: ChatAvatarInfo
};

export function useChatListData(userId?: string) {
  const { data: chatRooms = [], isLoading, error } = useChatRoomsByUser(userId);
  const { getRoomDisplayName } = useChatRoomDisplayName();
  const { getChatAvatarInfo } = useChatRoomAvatar();
  const markRoomAsReadMutation = useMarkRoomAsRead();

  const roomIds = useMemo(() => chatRooms.map((room) => room.id), [chatRooms]);

  const { data: unreadCounts = {} } = useUnreadMessageCountBatch(roomIds, userId);

  const processedRooms: ProcessedChatRoom[] = useMemo(() => {
    return chatRooms.map((room) => ({
      ...room,
      displayName: getRoomDisplayName(room),
      avatarInfo: getChatAvatarInfo(room),
    }));
  }, [chatRooms, getRoomDisplayName, getChatAvatarInfo]);

  const sortedRooms = useMemo(() => {
    return [...processedRooms].sort((a, b) => {
      const aLastMessage = a.last_message?.[0];
      const bLastMessage = b.last_message?.[0];

      if (aLastMessage && bLastMessage) {
        return new Date(bLastMessage.created_at).getTime() - new Date(aLastMessage.created_at).getTime();
      }

      if (aLastMessage && !bLastMessage) return -1;
      if (!aLastMessage && bLastMessage) return 1;

      const aTimestamp = a.updated_at || a.created_at;
      const bTimestamp = b.updated_at || b.created_at;

      if (!aTimestamp && !bTimestamp) return 0;
      if (!aTimestamp) return 1;
      if (!bTimestamp) return -1;

      return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime();
    });
  }, [processedRooms]);

  const handleRoomClick = useCallback((roomId: string) => {
    if (userId) {
      markRoomAsReadMutation.mutate({ roomId, userId });
    }
  }, [userId, markRoomAsReadMutation]);

  return {
    chatRooms: sortedRooms,
    unreadCounts,
    isLoading,
    error: error?.message || null,
    handleRoomClick,
  };
}

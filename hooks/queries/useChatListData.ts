"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUrl } from "@/hooks/use-url";
import { useChatRoomsByUser } from "@/hooks/queries/useChatRooms";
import { useChatRoomAvatar } from "@/hooks/useChatRoomAvatar";
import { useClientData } from "@/utils/data/client";
import type { ChatRoomWithDetails } from "@/utils/supabase/services/chat-rooms";

export interface ProcessedChatRoom {
  id: string;
  displayName: string;
  avatarUrl?: string;
  initials: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderName: string;
  };
  memberCount: number;
  updatedAt: string;
}

export function useChatListData(userId?: string) {
  const router = useRouter();
  const currentPath = useUrl();
  const { getChatAvatarInfo } = useChatRoomAvatar();
  const { chatRooms: chatRoomQueries } = useClientData();

  const {
    data: rawChatRooms = [],
    isLoading: isLoadingRooms,
    error: roomsError
  } = useChatRoomsByUser(userId || '');

  const roomIds = rawChatRooms.map(room => room.id);
  const {
    data: unreadCounts = {},
    isLoading: isLoadingCounts
  } = chatRoomQueries.useUnreadCountBatch(roomIds, userId || '');

  const chatRooms = useMemo((): ProcessedChatRoom[] => {
    if (!rawChatRooms.length) return [];

    return rawChatRooms.map((room: ChatRoomWithDetails) => {
      try {
        const avatarInfo = getChatAvatarInfo(room);
        const lastMessage = room.last_message?.[0];
        return {
          id: room.id,
          displayName: avatarInfo.displayName,
          avatarUrl: avatarInfo.avatarUrl,
          initials: avatarInfo.initials,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.created_at,
            senderName: lastMessage.sender_id === userId ? 'You' : (
              lastMessage.users ?
                `${lastMessage.users.first_name || ''} ${lastMessage.users.last_name || ''}`.trim() ||
                'Unknown User' : 'Unknown User'
            )
          } : undefined,
          memberCount: room.chat_room_participants?.length || 0,
          updatedAt: room.updated_at || room.created_at || ''
        };
      } catch (error) {
        console.error('Error processing chat room:', room.id, error);
        return {
          id: room.id,
          displayName: room.name || 'Unknown Chat',
          avatarUrl: undefined,
          initials: '??',
          lastMessage: undefined,
          memberCount: room.chat_room_participants?.length || 0,
          updatedAt: room.updated_at || room.created_at || ''
        };
      }
    }).sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.updatedAt;
      const bTime = b.lastMessage?.createdAt || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [rawChatRooms, getChatAvatarInfo]);

  const handleRoomClick = useCallback((roomId: string) => {
    router.push(`${currentPath}/${roomId}`);
  }, [router, currentPath]);

  const isLoading = isLoadingRooms || isLoadingCounts;
  const error = roomsError?.message || null;

  return {
    chatRooms,
    unreadCounts,
    isLoading,
    error,
    handleRoomClick,
  };
}

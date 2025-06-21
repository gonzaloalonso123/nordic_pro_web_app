'use client'

import { supabase } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { Tables } from '@/types/database.types'

export function useRealtimeChatList(
  userRoomIds: string[],
  userId: string | undefined,
  onNewMessage: (message: Tables<"messages">) => void
) {
  useEffect(() => {
    if (!userRoomIds.length || !userId) {
      console.log('useRealtimeChatList: No room IDs or user ID', { userRoomIds, userId });
      return;
    }
    console.log('useRealtimeChatList: Setting up subscription for rooms:', userRoomIds);

    const channel = supabase.channel('chat_list_updates');

    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=in.(${userRoomIds.join(',')})`
    }, (payload: { new: Tables<"messages"> }) => {
      console.log('useRealtimeChatList: Received message:', payload);
      const message = payload.new;
      onNewMessage(message);
    })

    channel.subscribe();

    return () => {
      console.log('useRealtimeChatList: Cleaning up subscription');
      supabase.removeChannel(channel);
    }
  }, [userRoomIds, userId, onNewMessage]);
}

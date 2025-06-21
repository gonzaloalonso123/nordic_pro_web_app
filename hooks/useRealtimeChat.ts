'use client'

import { supabase } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { Tables } from '@/types/database.types'

export function useRealtimeChat(roomId: string, onNewMessage: (message: Tables<"messages">) => void) {
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(roomId);
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      onNewMessage(payload.new as Tables<"messages">);
    })

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [roomId, onNewMessage]);
}

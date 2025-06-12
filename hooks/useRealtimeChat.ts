'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { Tables } from '@/types/database.types'

export function useRealtimeChat(roomId: string, onNewMessage: (message: Tables<"messages">) => void) {
  const supabase = createClient()

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(roomId)

    console.log(`Setting up realtime subscription for room: ${roomId}`);
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      console.log("New message inserted:", payload);
      onNewMessage(payload.new as Tables<"messages">);
    })

    console.log(`Subscribing to realtime channel for room: ${roomId}`);

    channel.subscribe();

    return () => {
      console.log(`Cleaning up realtime subscription for room: ${roomId}`);
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase, onNewMessage])
}

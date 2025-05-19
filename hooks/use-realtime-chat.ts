import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";

export function useRealtimeChat<T>(
  roomId: string,
  onNewMessage: (payload: T) => void
) {
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!roomId || !onNewMessage) return;

    // Create a unique channel name for this room

    const channel = supabase
      .channel(roomId)
      .on<Tables<"chat_messages">>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          onNewMessage(payload.new as unknown as T);
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setError(
            `Real-time connection issue: ${err?.message || status.toLowerCase()}`
          );
        } else if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to chat room ${roomId}`);
        }
      });

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, onNewMessage, supabase]);

  return { error };
}


import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";

export function useRealtimeChat<T>(
  roomId: string,
  onNewMessage: (payload: T) => void
) {
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const onNewMessageRef = useRef(onNewMessage);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on<Tables<"chat_messages">>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          onNewMessageRef.current(payload.new as unknown as T);
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setError(
            `Real-time connection issue: ${err?.message || status.toLowerCase()}`
          );
        } else if (status === "SUBSCRIBED") {
          setError(null);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  return { error };
}

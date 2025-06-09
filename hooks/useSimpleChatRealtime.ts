"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";

export function useSimpleChatRealtime(
  roomId: string,
  onNewMessage: (message: Tables<"messages">) => void
) {
  const [status, setStatus] = useState<string>("DISCONNECTED");
  const supabase = createClient();
  const onNewMessageRef = useRef(onNewMessage);

  // Update the callback ref without triggering re-subscription
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!roomId) return;

    setStatus("CONNECTING");

    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on<Tables<"messages">>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.new) {
            onNewMessageRef.current(payload.new);
          }
        }
      )
      .subscribe((status) => {
        setStatus(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  return {
    status,
    isConnected: status === "SUBSCRIBED"
  };
}
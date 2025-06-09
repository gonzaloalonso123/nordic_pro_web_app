import { useState, useEffect, useCallback, useRef } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type Message = Tables<"messages"> & {
  users?: Tables<"users">;
};

interface UseChatRoomMessagesProps {
  supabase: SupabaseClient<Database>;
  roomId: string;
  currentUser: Tables<"users">;
}

export function useChatRoomMessages({ roomId, currentUser }: UseChatRoomMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*, users:sender_id (id, first_name, avatar)")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
      await supabase
        .from("chat_room_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("room_id", roomId)
        .eq("user_id", currentUser.id);
    }

    setLoading(false);
  }, [roomId, currentUser.id, supabase]);

  const handleRealtimeInsert = useCallback(
    async (payload: { new: Message }) => {
      if (payload.new.room_id !== roomId) return;

      const { data: newMessageWithUser, error } = await supabase
        .from("messages")
        .select("*, users:sender_id (id, first_name, avatar)")
        .eq("id", payload.new.id)
        .single();

      if (error) {
        console.error("Error loading realtime message:", error);
        setMessages((prev) => [...prev.filter((m) => !m.id.includes("temp")), payload.new]);
      } else {
        setMessages((prev) => [...prev.filter((m) => !m.id.includes("temp")), newMessageWithUser!]);
      }

      if (payload.new.sender_id !== currentUser.id) {
        await supabase
          .from("chat_room_participants")
          .update({ last_read_at: new Date().toISOString() })
          .eq("room_id", roomId)
          .eq("user_id", currentUser.id);
      }
    },
    [roomId, supabase, currentUser.id]
  );

  const subscribeToRoom = useCallback(() => {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        handleRealtimeInsert
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Realtime subscription error:", status, err);
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, roomId, handleRealtimeInsert]);

  useEffect(() => {
    fetchMessages();
    const cleanup = subscribeToRoom();
    return () => {
      cleanup();
    };
  }, [fetchMessages, subscribeToRoom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setSending(true);
      const tempMessageId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempMessageId,
        room_id: roomId,
        sender_id: currentUser.id,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        users: currentUser,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      const { error } = await supabase.from("messages").insert({ room_id: roomId, sender_id: currentUser.id, content });

      if (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));
      }

      setSending(false);
    },
    [supabase, roomId, currentUser]
  );

  return {
    messages,
    loading,
    sending,
    sendMessage,
  };
}

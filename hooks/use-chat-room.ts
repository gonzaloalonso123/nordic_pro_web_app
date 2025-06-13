import { useState, useEffect, useCallback, useRef } from "react";
import type { Tables } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type Message = Tables<"messages"> & {
  users: {
    id: string;
    first_name: string;
    avatar: string | null;
  }
};

interface UseChatRoomMessagesProps {
  roomId: string;
  currentUser: Tables<"users">;
}

export function useChatRoomMessages({ roomId, currentUser }: UseChatRoomMessagesProps) {
  if (!roomId || !currentUser) {
    return {
      messages: [],
      loading: false,
      sending: false,
      sendMessage: async () => { },
    };
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch messages and update last_read_at
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
      setMessages(
        (data || []).map((msg) => ({
          ...msg,
          id: msg.id || `temp-${Date.now()}`,
          users: {
            id: msg.users?.id || "",
            first_name: msg.users?.first_name || "",
            avatar: msg.users?.avatar || null,
          },
        }))
      );
      await supabase
        .from("chat_room_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("room_id", roomId)
        .eq("user_id", currentUser.id);
    }
    setLoading(false);
  }, [roomId, currentUser.id]);

  // Handle new realtime message
  const handleRealtimeInsert = useCallback(
    async (payload: { new: Message }) => {
      if (payload.new.room_id !== roomId) return;

      const { data: newMessageWithUser, error } = await supabase
        .from("messages")
        .select("*, users:sender_id (id, first_name, avatar)")
        .eq("id", payload.new.id)
        .single();

      if (newMessageWithUser) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.id.includes("temp")),
          newMessageWithUser as Message,
        ]);
      } else {
        // fallback: do not add if not a valid Message
        setMessages((prev) => [
          ...prev.filter((m) => !m.id.includes("temp")),
        ]);
      }

      if (payload.new.sender_id !== currentUser.id) {
        await supabase
          .from("chat_room_participants")
          .update({ last_read_at: new Date().toISOString() })
          .eq("room_id", roomId)
          .eq("user_id", currentUser.id);
      }
    },
    [roomId, currentUser.id]
  );

  // Subscribe to realtime changes for this room
  useEffect(() => {
    fetchMessages();

    // Clean up previous channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

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
        console.log("Supabase channel status:", status, "error:", err);
        if (status === "SUBSCRIBED") {
          console.log("Realtime suscripción exitosa");
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Realtime subscription error:", status, "error:", err);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, fetchMessages, handleRealtimeInsert]);

  // Send a message (optimistic update)
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

      const { error } = await supabase.from("messages").insert({
        room_id: roomId,
        sender_id: currentUser.id,
        content,
      });

      if (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));
      }

      setSending(false);
    },
    [roomId, currentUser]
  );

  return {
    messages,
    loading,
    sending,
    sendMessage,
  };
}
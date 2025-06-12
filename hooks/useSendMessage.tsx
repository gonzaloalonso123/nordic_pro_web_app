"use client";

import { useState, useCallback } from "react";
import { useClientData } from "@/utils/data/client";
import { TablesInsert } from "@/types/database.types";

export function useSendMessage(roomId: string, currentUserId: string) {
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { chatMessages } = useClientData();

  const { mutateAsync: createMessage } = chatMessages.useCreateChatMessage({
    onError: (err: { message: any; }) => setError(`Failed to send message: ${err.message}`)
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentUserId || !roomId || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const messageData: TablesInsert<"messages"> = {
        room_id: roomId,
        sender_id: currentUserId,
        content: content.trim(),
      };

      await createMessage(messageData);
    } catch (err: any) {
      setError(`Failed to send message: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  }, [roomId, currentUserId, createMessage, isSending]);

  return {
    sendMessage,
    error,
    isSending
  };
}


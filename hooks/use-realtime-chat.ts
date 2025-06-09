import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";

// Connection status enum for better type safety
export const ConnectionStatus = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  RECONNECTING: "RECONNECTING",
  ERROR: "ERROR"
} as const;

export type ConnectionStatusType = typeof ConnectionStatus[keyof typeof ConnectionStatus];

export interface RealtimeState {
  status: ConnectionStatusType;
  error: string | null;
  isConnected: boolean;
}
export function useRealtimeChat(
  roomId: string,
  onNewMessage: (payload: Tables<"messages">) => void
): RealtimeState {
  const [status, setStatus] = useState<ConnectionStatusType>(ConnectionStatus.DISCONNECTED);
  const [error, setError] = useState<string | null>(null);

  const onNewMessageRef = useRef(onNewMessage);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const reconnectAttemptsRef = useRef(0);

  // Maximum reconnection attempts and exponential backoff
  const MAX_RECONNECT_ATTEMPTS = 5;
  const BASE_RECONNECT_DELAY = 1000; // 1 second
  // Stable channel name - don't change on reconnection
  const channelName = `chat_room_${roomId}`;
  // Clear any pending reconnection attempts
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  // Exponential backoff calculation
  const getReconnectDelay = useCallback(() => {
    const attempt = reconnectAttemptsRef.current;
    return Math.min(BASE_RECONNECT_DELAY * Math.pow(2, attempt), 30000); // Max 30 seconds
  }, []);
  useEffect(() => {
    if (!roomId) {
      setStatus(ConnectionStatus.DISCONNECTED);
      setError(null);
      return;
    }

    const cleanupChannel = () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Error removing channel:', err);
          }
        }
        channelRef.current = null;
      }
    };

    const setupChannel = () => {
      // Clean up existing channel first
      cleanupChannel();

      if (!isMountedRef.current) return;
      setStatus(reconnectAttemptsRef.current > 0 ? ConnectionStatus.RECONNECTING : ConnectionStatus.CONNECTING);
      setError(null);

      try {
        const channel = supabase
          .channel(channelName)
          .on<Tables<"messages">>(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `room_id=eq.${roomId}`,
            },
            (payload) => {
              if (isMountedRef.current && payload.new) {
                try {
                  onNewMessageRef.current(payload.new);
                } catch (err) {
                  if (process.env.NODE_ENV === 'development') {
                    console.error('Error handling new message:', err);
                  }
                }
              }
            }
          );

        channel.subscribe((subscriptionStatus, err) => {
          if (!isMountedRef.current) return;

          if (process.env.NODE_ENV === 'development') {
            console.log(`Realtime subscription status for room ${roomId}:`, subscriptionStatus);
          }


          switch (subscriptionStatus) {
            case "SUBSCRIBED":
              setStatus(ConnectionStatus.CONNECTED);
              setError(null);
              reconnectAttemptsRef.current = 0; // Reset on successful connection
              clearReconnectTimeout();
              if (process.env.NODE_ENV === 'development') {
                console.log(`Successfully subscribed to realtime for room ${roomId}`);
              }
              break;

            case "CHANNEL_ERROR":
            case "TIMED_OUT":
              const errorMessage = err?.message || `Connection ${subscriptionStatus.toLowerCase()}`;
              setStatus(ConnectionStatus.ERROR);
              setError(`Connection issue: ${errorMessage}`);

              if (process.env.NODE_ENV === 'development') {
                console.error(`Realtime error for room ${roomId}:`, errorMessage);
              }

              // Retry with exponential backoff if under max attempts
              if (isMountedRef.current && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                clearReconnectTimeout();
                const delay = getReconnectDelay();
                reconnectAttemptsRef.current += 1;

                reconnectTimeoutRef.current = setTimeout(() => {
                  if (isMountedRef.current) {
                    setupChannel();
                  }
                }, delay);
              }
              break;

            case "CLOSED":
              setStatus(ConnectionStatus.DISCONNECTED);
              if (process.env.NODE_ENV === 'development') {
                console.log(`Realtime connection closed for room ${roomId}`);
              }

              // Attempt to reconnect if still mounted and under max attempts
              if (isMountedRef.current && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                clearReconnectTimeout();
                const delay = getReconnectDelay();
                reconnectAttemptsRef.current += 1;

                reconnectTimeoutRef.current = setTimeout(() => {
                  if (isMountedRef.current) {
                    setupChannel();
                  }
                }, delay);
              }
              break;
          }
        });

        channelRef.current = channel;
      } catch (err) {
        setStatus(ConnectionStatus.ERROR);
        setError('Failed to setup realtime connection');
        if (process.env.NODE_ENV === 'development') {
          console.error('Error setting up realtime channel:', err);
        }
      }
    };

    // Initial setup
    setupChannel();

    return () => {
      isMountedRef.current = false;

      // Clear reconnect timeout
      clearReconnectTimeout();

      // Clean up channel
      cleanupChannel();

      // Reset state
      setStatus(ConnectionStatus.DISCONNECTED);
      setError(null);
      reconnectAttemptsRef.current = 0;
    };
  }, [roomId, getReconnectDelay, clearReconnectTimeout]);

  return {
    status,
    error,
    isConnected: status === ConnectionStatus.CONNECTED
  };
}

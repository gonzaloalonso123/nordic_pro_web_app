"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";

// Global realtime manager to prevent multiple subscriptions
class ChatRealtimeManager {
  private static instance: ChatRealtimeManager;
  private supabase = createClient();
  private subscriptions = new Map<string, {
    channel: ReturnType<typeof this.supabase.channel>;
    subscribers: Set<(message: Tables<"messages">) => void>;
    status: string;
  }>();
  private reconnectTimeouts = new Map<string, NodeJS.Timeout>();

  static getInstance(): ChatRealtimeManager {
    if (!ChatRealtimeManager.instance) {
      ChatRealtimeManager.instance = new ChatRealtimeManager();
    }
    return ChatRealtimeManager.instance;
  }

  subscribe(roomId: string, callback: (message: Tables<"messages">) => void): () => void {
    console.log(`Subscribing to room ${roomId}`);
    if (!roomId) return () => {};

    let subscription = this.subscriptions.get(roomId);

    if (!subscription) {
      // Create new subscription for this room
      subscription = this.createSubscription(roomId);
      this.subscriptions.set(roomId, subscription);
    }

    // Add callback to subscribers
    subscription.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      const sub = this.subscriptions.get(roomId);
      if (sub) {
        sub.subscribers.delete(callback);

        // If no more subscribers, clean up the subscription
        if (sub.subscribers.size === 0) {
          // Cancel any pending reconnections first
          const timeout = this.reconnectTimeouts.get(roomId);
          if (timeout) {
            clearTimeout(timeout);
            this.reconnectTimeouts.delete(roomId);
          }
          this.cleanup(roomId);
        }
      }
    };
  }

  private createSubscription(roomId: string) {
    const channelName = `chat_room_${roomId}`;
    const subscribers = new Set<(message: Tables<"messages">) => void>();

    const channel = this.supabase
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
          if (payload.new) {
            // Notify all subscribers
            subscribers.forEach(callback => {
              try {
                callback(payload.new);
              } catch (error) {
                console.error('Error in realtime callback:', error);
              }
            });
          }
        }
      );

    channel.subscribe((status, err) => {
      const subscription = this.subscriptions.get(roomId);
      if (subscription && subscribers.size > 0) {
        subscription.status = status;

        switch (status) {
          case "SUBSCRIBED":
            // Clear any reconnect timeout
            const timeout = this.reconnectTimeouts.get(roomId);
            if (timeout) {
              clearTimeout(timeout);
              this.reconnectTimeouts.delete(roomId);
            }

            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ Realtime subscribed to room ${roomId}`);
            }
            break;

          case "CHANNEL_ERROR":
          case "TIMED_OUT":
          case "CLOSED":
            if (process.env.NODE_ENV === 'development') {
              console.warn(`⚠️ Realtime ${status} for room ${roomId}:`, err?.message);
            }

            // Only attempt reconnection if there are still subscribers AND subscription still exists
            if (subscribers.size > 0 && this.subscriptions.has(roomId)) {
              this.scheduleReconnect(roomId);
            }
            break;
        }
      }
    });

    return {
      channel,
      subscribers,
      status: "CONNECTING"
    };
  }

  private scheduleReconnect(roomId: string) {
    // Clear existing timeout
    const existingTimeout = this.reconnectTimeouts.get(roomId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    // Don't reconnect if subscription doesn't exist or has no subscribers
    const subscription = this.subscriptions.get(roomId);
    if (!subscription || subscription.subscribers.size === 0) {
      return;
    }

    // Schedule reconnection
    const timeout = setTimeout(() => {
      const subscription = this.subscriptions.get(roomId);
      if (subscription && subscription.subscribers.size > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 Reconnecting to room ${roomId}`);
        }

        try {
          // Store callbacks before cleanup
          const callbacks = Array.from(subscription.subscribers);

          // Remove old subscription completely
          this.cleanup(roomId, true);

          // Only recreate if we still have callbacks
          if (callbacks.length > 0) {
            const newSubscription = this.createSubscription(roomId);
            callbacks.forEach(callback => newSubscription.subscribers.add(callback));
            this.subscriptions.set(roomId, newSubscription);
          }
        } catch (error) {
          console.error('Error during reconnection:', error);
        }
      }
      this.reconnectTimeouts.delete(roomId);
    }, 2000);

    this.reconnectTimeouts.set(roomId, timeout);
  }

  private cleanup(roomId: string, removeFromMap = true) {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      // Clear subscribers first to prevent any callbacks during cleanup
      subscription.subscribers.clear();

      try {
        // Unsubscribe from the channel before removing it
        subscription.channel.unsubscribe();
        setTimeout(() => {
          this.supabase.removeChannel(subscription.channel);
        }, 100);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }

      if (removeFromMap) {
        this.subscriptions.delete(roomId);
      }
    }

    // Clear reconnect timeout
    const timeout = this.reconnectTimeouts.get(roomId);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(roomId);
    }
  }

  getStatus(roomId: string): string {
    return this.subscriptions.get(roomId)?.status || "DISCONNECTED";
  }

  // Cleanup all subscriptions (useful for app shutdown)
  cleanup() {
    console.log('Cleaning up all chat subscriptions');
    this.subscriptions.forEach((_, roomId) => {
      this.cleanup(roomId);
    });
    this.subscriptions.clear();
    this.reconnectTimeouts.forEach(timeout => clearTimeout(timeout));
    this.reconnectTimeouts.clear();
  }
}

// Hook to use the global realtime manager
export function useGlobalChatRealtime(
  roomId: string,
  onNewMessage: (message: Tables<"messages">) => void
) {
  const [status, setStatus] = useState<string>("DISCONNECTED");
  const managerRef = useRef<ChatRealtimeManager>();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const onNewMessageRef = useRef(onNewMessage);

  // Get manager instance
  if (!managerRef.current) {
    managerRef.current = ChatRealtimeManager.getInstance();
  }
  // Update the callback ref without triggering re-subscription
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  // Update status periodically
  useEffect(() => {
    if (!roomId || !managerRef.current) return;

    const updateStatus = () => {
      const currentStatus = managerRef.current!.getStatus(roomId);
      setStatus(currentStatus);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [roomId]);

  // Subscribe to room
  useEffect(() => {
    if (!roomId || !managerRef.current) return;

    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to new room
    unsubscribeRef.current = managerRef.current.subscribe(roomId, (message) => {
      onNewMessageRef.current(message);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [roomId]);

  return {
    status,
    isConnected: status === "SUBSCRIBED"
  };
}

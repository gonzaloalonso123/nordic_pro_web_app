import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"

type RealtimeSubscriptionCallback<T> = (payload: T) => void

export const supabaseRealtime = {
  // Subscribe to chat messages
  subscribeToChatMessages: (
    supabase: SupabaseClient<Database>,
    roomId: string,
    callback: RealtimeSubscriptionCallback<any>,
  ) => {
    const subscription = supabase
      .channel(`chat_messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_room_id=eq.${roomId}`,
        },
        (payload) => {
          callback(payload.new)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  },

  // Subscribe to events
  subscribeToEvents: (
    supabase: SupabaseClient<Database>,
    calendarId: string,
    callback: RealtimeSubscriptionCallback<any>,
  ) => {
    const subscription = supabase
      .channel(`events:${calendarId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "events",
          filter: `calendar_id=eq.${calendarId}`,
        },
        (payload) => {
          callback(payload)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  },

  // Subscribe to user status
  subscribeToUserStatus: (
    supabase: SupabaseClient<Database>,
    userId: string,
    callback: RealtimeSubscriptionCallback<any>,
  ) => {
    const subscription = supabase
      .channel(`users:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  },

  // Subscribe to team changes
  subscribeToTeam: (
    supabase: SupabaseClient<Database>,
    teamId: string,
    callback: RealtimeSubscriptionCallback<any>,
  ) => {
    const subscription = supabase
      .channel(`teams:${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        (payload) => {
          callback(payload)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  },

  // Subscribe to chat room changes
  subscribeToChatRoom: (
    supabase: SupabaseClient<Database>,
    roomId: string,
    callback: RealtimeSubscriptionCallback<any>,
  ) => {
    const subscription = supabase
      .channel(`chat_rooms:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          callback(payload.new)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  },
}

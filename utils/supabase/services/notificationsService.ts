import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type NotificationRow = Tables<"notifications">
export type NotificationInsert = TablesInsert<"notifications">
export type NotificationUpdate = TablesUpdate<"notifications">
export type NotificationType = "event" | "roster" | "feedback" | "trophy" | "message" | "general"

export const notificationsService = {
  // Get notification by ID
  getById: async (supabase: TypedSupabaseClient, notificationId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("notification_id", notificationId)
      .single()

    if (error) throw error
    return data
  },

  // Get notifications by user
  getByUser: async (supabase: TypedSupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get unread notifications by user
  getUnreadByUser: async (supabase: TypedSupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get notifications by type and user
  getByTypeAndUser: async (supabase: TypedSupabaseClient, type: NotificationType, userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("type", type)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Create a notification
  create: async (supabase: TypedSupabaseClient, notification: NotificationInsert) => {
    const { data, error } = await supabase.from("notifications").insert(notification).select().single()

    if (error) throw error
    return data
  },

  // Create notifications for multiple users
  createBatch: async (
    supabase: TypedSupabaseClient,
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType,
  ) => {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
    }))

    const { data, error } = await supabase.from("notifications").insert(notifications).select()

    if (error) throw error
    return data
  },

  // Mark notification as read
  markAsRead: async (supabase: TypedSupabaseClient, notificationId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("notification_id", notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (supabase: TypedSupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .select()

    if (error) throw error
    return data
  },

  // Mark all notifications as read by type for a user
  markAllByTypeAsRead: async (supabase: TypedSupabaseClient, userId: string, type: NotificationType) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("type", type)
      .eq("is_read", false)
      .select()

    if (error) throw error
    return data
  },

  // Update a notification
  update: async (supabase: TypedSupabaseClient, notificationId: string, updates: NotificationUpdate) => {
    const { data, error } = await supabase
      .from("notifications")
      .update(updates)
      .eq("notification_id", notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a notification
  delete: async (supabase: TypedSupabaseClient, notificationId: string) => {
    const { error } = await supabase.from("notifications").delete().eq("notification_id", notificationId)

    if (error) throw error
    return true
  },

  // Delete all notifications for a user
  deleteAllForUser: async (supabase: TypedSupabaseClient, userId: string) => {
    const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

    if (error) throw error
    return true
  },
}


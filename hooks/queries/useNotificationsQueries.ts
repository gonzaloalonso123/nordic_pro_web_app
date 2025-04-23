import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { NotificationInsert, NotificationRow, notificationsService, NotificationType, NotificationUpdate } from "@/utils/supabase/services";
import useSupabaseBrowser from "@/utils/supabase/client";

// Get notification by ID
export const useNotification = <TData = NotificationRow>(
  notificationId: string | undefined,
  options?: Omit<UseQueryOptions<NotificationRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  const supabase = useSupabaseBrowser();
  return useQuery<NotificationRow | null, Error, TData>({
    queryKey: ["notifications", notificationId],
    queryFn: () => (notificationId ? notificationsService.getById(supabase, notificationId) : null),
    enabled: !!notificationId,
    ...options,
  });
};

// Get notifications by user
export const useNotificationsByUser = <TData = NotificationRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<NotificationRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  const supabase = useSupabaseBrowser();
  return useQuery<NotificationRow[] | null, Error, TData>({
    queryKey: ["notifications", "user", userId],
    queryFn: () => (userId ? notificationsService.getByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

// Get unread notifications by user
export const useUnreadNotificationsByUser = <TData = NotificationRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<NotificationRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  const supabase = useSupabaseBrowser();
  return useQuery<NotificationRow[] | null, Error, TData>({
    queryKey: ["notifications", "user", userId, "unread"],
    queryFn: () => (userId ? notificationsService.getUnreadByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

// Get notifications by type and user
export const useNotificationsByTypeAndUser = <TData = NotificationRow[]>(
  type: NotificationType | undefined,
  userId: string | undefined,
  options?: Omit<UseQueryOptions<NotificationRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  const supabase = useSupabaseBrowser();
  return useQuery<NotificationRow[] | null, Error, TData>({
    queryKey: ["notifications", "type", type, "user", userId],
    queryFn: () => (type && userId ? notificationsService.getByTypeAndUser(supabase, type, userId) : null),
    enabled: !!(type && userId),
    ...options,
  });
};

// Create a notification mutation
export const useCreateNotification = (
  options?: Omit<UseMutationOptions<NotificationRow, Error, NotificationInsert>, "mutationFn">
) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<NotificationRow, Error, NotificationInsert>({
    mutationFn: (notification: NotificationInsert) => notificationsService.create(supabase, notification),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", data.user_id, "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "type", data.type, "user", data.user_id] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Create notifications for multiple users mutation
export const useCreateBatchNotifications = (
  options?: Omit<
    UseMutationOptions<
      NotificationRow[],
      Error,
      {
        userIds: string[];
        title: string;
        message: string;
        type: NotificationType;
      }
    >,
    "mutationFn"
  >
) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<
    NotificationRow[],
    Error,
    {
      userIds: string[];
      title: string;
      message: string;
      type: NotificationType;
    }
  >({
    mutationFn: ({ userIds, title, message, type }) =>
      notificationsService.createBatch(supabase, userIds, title, message, type),
    onSuccess: (data, variables, context) => {
      variables.userIds.forEach((userId) => {
        queryClient.invalidateQueries({ queryKey: ["notifications", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["notifications", "user", userId, "unread"] });
        queryClient.invalidateQueries({ queryKey: ["notifications", "type", variables.type, "user", userId] });
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Mark notification as read mutation
export const useMarkAsRead = (options?: Omit<UseMutationOptions<NotificationRow, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<NotificationRow, Error, string>({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(supabase, notificationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", data.notification_id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", data.user_id, "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "type", data.type, "user", data.user_id] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Mark all notifications as read for a user mutation
export const useMarkAllAsRead = (
  options?: Omit<UseMutationOptions<NotificationRow[], Error, string>, "mutationFn">
) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<NotificationRow[], Error, string>({
    mutationFn: (userId: string) => notificationsService.markAllAsRead(supabase, userId),
    onSuccess: (data, userId, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", userId] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", userId, "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "type", undefined, "user", userId] });
      options?.onSuccess?.(data, userId, context);
    },
    ...options,
  });
};

export const useMarkAllAsReadForType = (
  options?: Omit<UseMutationOptions<NotificationRow[], Error, { userId: string; type: NotificationType }>, "mutationFn">
) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  return useMutation<NotificationRow[], Error, { userId: string; type: NotificationType }>({
    mutationFn: ({ userId, type }) => notificationsService.markAllByTypeAsRead(supabase, userId, type),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", variables.userId, "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "type", variables.type, "user", variables.userId] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update a notification mutation
export const useUpdateNotification = (
  options?: Omit<
    UseMutationOptions<NotificationRow, Error, { notificationId: string; updates: NotificationUpdate }>,
    "mutationFn"
  >
) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<NotificationRow, Error, { notificationId: string; updates: NotificationUpdate }>({
    mutationFn: ({ notificationId, updates }) => notificationsService.update(supabase, notificationId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", data.notification_id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", data.user_id, "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "type", data.type, "user", data.user_id] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete a notification mutation
export const useDeleteNotification = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (notificationId: string) => notificationsService.delete(supabase, notificationId),
    onSuccess: (data, notificationId, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      options?.onSuccess?.(data, notificationId, context);
    },
    ...options,
  });
};

// Delete all notifications for a user mutation
export const useDeleteAllForUser = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (userId: string) => notificationsService.deleteAllForUser(supabase, userId),
    onSuccess: (data, userId, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", userId] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "user", userId, "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "type", undefined, "user", userId] });
      options?.onSuccess?.(data, userId, context);
    },
    ...options,
  });
};

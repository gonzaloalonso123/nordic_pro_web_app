import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { chatRoomsService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type ChatRoomRow = Tables<"chat_rooms">
type ChatRoomInsert = TablesInsert<"chat_rooms">
type ChatRoomUpdate = TablesUpdate<"chat_rooms">

// Get all chat rooms
export const useChatRooms = <TData = ChatRoomRow[]>(
  options?: Omit<UseQueryOptions<ChatRoomRow[], Error, TData>, "queryKey" | "queryFn">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<ChatRoomRow[], Error, TData>({
    queryKey: ["chatRooms"],
    queryFn: () => chatRoomsService.getAll(supabase),
    ...options,
  })
}

// Get chat room by ID
export const useChatRoom = <TData = ChatRoomRow>(
  chatRoomId: string | undefined,
  options?: Omit<UseQueryOptions<ChatRoomRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<ChatRoomRow | null, Error, TData>({
    queryKey: ["chatRooms", chatRoomId],
    queryFn: () => (chatRoomId ? chatRoomsService.getById(supabase, chatRoomId) : null),
    enabled: !!chatRoomId,
    ...options,
  })
}

// Get chat rooms by user
export const useChatRoomsByUser = <TData = ChatRoomRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<ChatRoomRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<ChatRoomRow[] | null, Error, TData>({
    queryKey: ["chatRooms", "user", userId],
    queryFn: () => (userId ? chatRoomsService.getByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  })
}

// Get chat room with messages
export const useChatRoomWithMessages = <TData = any>(
  chatRoomId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any | null, Error, TData>({
    queryKey: ["chatRooms", chatRoomId, "messages"],
    queryFn: () => (chatRoomId ? chatRoomsService.getWithMessages(supabase, chatRoomId) : null),
    enabled: !!chatRoomId,
    ...options,
  })
}

// Get chat room with users
export const useChatRoomWithUsers = <TData = any>(
  chatRoomId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any | null, Error, TData>({
    queryKey: ["chatRooms", chatRoomId, "users"],
    queryFn: () => (chatRoomId ? chatRoomsService.getWithUsers(supabase, chatRoomId) : null),
    enabled: !!chatRoomId,
    ...options,
  })
}

// Create chat room mutation
export const useCreateChatRoom = (
  options?: Omit<UseMutationOptions<ChatRoomRow, Error, ChatRoomInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<ChatRoomRow, Error, ChatRoomInsert>({
    mutationFn: (chatRoom: ChatRoomInsert) => chatRoomsService.create(supabase, chatRoom),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update chat room mutation
export const useUpdateChatRoom = (
  options?: Omit<UseMutationOptions<ChatRoomRow, Error, { chatRoomId: string; updates: ChatRoomUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<ChatRoomRow, Error, { chatRoomId: string; updates: ChatRoomUpdate }>({
    mutationFn: ({ chatRoomId, updates }) => chatRoomsService.update(supabase, chatRoomId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.chatRoomId] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.chatRoomId, "messages"] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.chatRoomId, "users"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete chat room mutation
export const useDeleteChatRoom = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (chatRoomId: string) => chatRoomsService.delete(supabase, chatRoomId),
    onSuccess: (data, chatRoomId, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", chatRoomId] })
      options?.onSuccess?.(data, chatRoomId, context)
    },
    ...options,
  })
}

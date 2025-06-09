"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";

type ChatMessage = Tables<"messages"> & {
  users?: Pick<Tables<"users">, "id" | "first_name" | "last_name" | "avatar"> | null;
};

interface MessagePage {
  messages: ChatMessage[];
  nextCursor?: string;
  hasMore: boolean;
}

interface UseChatMessagesPaginatedOptions {
  limit?: number;
  enabled?: boolean;
}

export function useChatMessagesPaginated(
  roomId: string,
  options: UseChatMessagesPaginatedOptions = {}
) {
  const { limit = 50, enabled = true } = options;
  const supabase = createClient();

  return useInfiniteQuery<MessagePage, Error>({
    queryKey: ["chatMessages", "paginated", roomId, limit],
    queryFn: async ({ pageParam }): Promise<MessagePage> => {
      if (!roomId) {
        return { messages: [], hasMore: false };
      }

      let query = supabase
        .from("messages")
        .select(`
          *,
          users!messages_sender_id_fkey1(
            id,
            first_name,
            last_name,
            avatar
          )
        `)
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (pageParam) {
        query = query.lt("created_at", pageParam as string);
      }

      const { data, error } = await query;

      if (error) throw error;

      const messages = data || [];
      const hasMore = messages.length === limit;
      const nextCursor = hasMore && messages.length > 0
        ? messages[messages.length - 1].created_at || undefined
        : undefined;

      const chronologicalMessages = messages.reverse();

      return {
        messages: chronologicalMessages,
        nextCursor,
        hasMore,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && !!roomId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useFlattenedChatMessages(roomId: string, options?: UseChatMessagesPaginatedOptions) {
  const query = useChatMessagesPaginated(roomId, options);

  const allMessages = query.data?.pages.flatMap((page: MessagePage) => page.messages) ?? [];

  return {
    ...query,
    messages: allMessages,
    hasMoreMessages: query.hasNextPage,
    loadMoreMessages: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
}

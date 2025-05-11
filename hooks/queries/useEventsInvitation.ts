import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/utils/database.types";
import { createClient } from "@/utils/supabase/client";
import { eventsInvitationService } from "@/utils/supabase/services/events-invitation";

type EventInvitationRow = Tables<"events_invitation">;
type EventInvitationInsert = TablesInsert<"events_invitation">;
type EventInvitationUpdate = TablesUpdate<"events_invitation">;

// Get all invitations
export const useEventsInvitations = <TData = EventInvitationRow[]>(
  options?: Omit<
    UseQueryOptions<EventInvitationRow[], Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const supabase = createClient();
  return useQuery<EventInvitationRow[], Error, TData>({
    queryKey: ["events_invitation"],
    queryFn: () => eventsInvitationService.getAll(supabase),
    ...options,
  });
};

// Get invitation by ID
export const useEventInvitation = <TData = EventInvitationRow>(
  invitationId: string | undefined,
  options?: Omit<
    UseQueryOptions<EventInvitationRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<EventInvitationRow | null, Error, TData>({
    queryKey: ["events_invitation", invitationId],
    queryFn: () =>
      invitationId
        ? eventsInvitationService.getById(supabase, invitationId)
        : null,
    enabled: !!invitationId,
    ...options,
  });
};

// Get invitations by event
export const useEventInvitationsByEvent = <TData = EventInvitationRow[]>(
  eventId: string | undefined,
  options?: Omit<
    UseQueryOptions<EventInvitationRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<EventInvitationRow[] | null, Error, TData>({
    queryKey: ["events_invitation", "event", eventId],
    queryFn: () =>
      eventId ? eventsInvitationService.getByEvent(supabase, eventId) : null,
    enabled: !!eventId,
    ...options,
  });
};

// Get invitations by user
export const useEventInvitationsByUser = <TData = EventInvitationRow[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<EventInvitationRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<EventInvitationRow[] | null, Error, TData>({
    queryKey: ["events_invitation", "user", userId],
    queryFn: () =>
      userId ? eventsInvitationService.getByUser(supabase, userId) : null,
    enabled: !!userId,
    ...options,
  });
};

// Get invitation by event and user
export const useEventInvitationByEventAndUser = <
  TData = EventInvitationRow | null,
>(
  eventId: string | undefined,
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<EventInvitationRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<EventInvitationRow | null, Error, TData>({
    queryKey: ["events_invitation", "event", eventId, "user", userId],
    queryFn: () =>
      eventId && userId
        ? eventsInvitationService.getByEventAndUser(supabase, eventId, userId)
        : null,
    enabled: !!eventId && !!userId,
    ...options,
  });
};

// Create invitation mutation
export const useCreateEventInvitation = (
  options?: Omit<
    UseMutationOptions<EventInvitationRow, Error, EventInvitationInsert>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<EventInvitationRow, Error, EventInvitationInsert>({
    mutationFn: (invitation: EventInvitationInsert) =>
      eventsInvitationService.create(supabase, invitation),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["events_invitation"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update invitation mutation
export const useUpdateEventInvitation = (
  options?: Omit<
    UseMutationOptions<
      EventInvitationRow,
      Error,
      { invitationId: string; updates: EventInvitationUpdate }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    EventInvitationRow,
    Error,
    { invitationId: string; updates: EventInvitationUpdate }
  >({
    mutationFn: ({ invitationId, updates }) =>
      eventsInvitationService.update(supabase, invitationId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["events_invitation"] });
      queryClient.invalidateQueries({
        queryKey: ["events_invitation", variables.invitationId],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete invitation mutation
export const useDeleteEventInvitation = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (invitationId: string) =>
      eventsInvitationService.delete(supabase, invitationId),
    onSuccess: (data, invitationId, context) => {
      queryClient.invalidateQueries({ queryKey: ["events_invitation"] });
      queryClient.invalidateQueries({
        queryKey: ["events_invitation", invitationId],
      });
      options?.onSuccess?.(data, invitationId, context);
    },
    ...options,
  });
};

// Bulk create invitations
export const useBulkCreateEventInvitations = (
  options?: Omit<
    UseMutationOptions<EventInvitationRow[], Error, EventInvitationInsert[]>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<EventInvitationRow[], Error, EventInvitationInsert[]>({
    mutationFn: (invitations: EventInvitationInsert[]) =>
      eventsInvitationService.bulkCreate(supabase, invitations),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["events_invitation"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Get invitation with user details
export const useEventInvitationWithUserDetails = <TData = any>(
  invitationId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["events_invitation", invitationId, "userDetails"],
    queryFn: () =>
      invitationId
        ? eventsInvitationService.getWithUserDetails(supabase, invitationId)
        : null,
    enabled: !!invitationId,
    ...options,
  });
};

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { eventsCalendarsService, eventsService } from "@/utils/supabase/services";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type EventRow = Tables<"events">;
type EventInsert = TablesInsert<"events">;
type EventUpdate = TablesUpdate<"events">;
type EventType = "MEETING" | "TRAINING" | "EVENT";

// Get all events
export const useEvents = <TData = EventRow[]>(
  options?: Omit<UseQueryOptions<EventRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<EventRow[], Error, TData>({
    queryKey: ["events"],
    queryFn: () => eventsService.getAll(supabase),
    ...options,
  });
};

// Get event by ID
export const useEvent = <TData = EventRow>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow | null, Error, TData>({
    queryKey: ["events", eventId],
    queryFn: () => (eventId ? eventsService.getById(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  });
};

// Get events by team
export const useEventsByTeam = <TData = EventRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "team", teamId],
    queryFn: () => (teamId ? eventsService.getByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get upcoming events by team
export const useUpcomingEventsByTeam = <TData = EventRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "team", teamId, "upcoming"],
    queryFn: () => (teamId ? eventsService.getUpcomingByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get past events by team
export const usePastEventsByTeam = <TData = EventRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "team", teamId, "past"],
    queryFn: () => (teamId ? eventsService.getPastByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get events by type and team
export const useEventsByTypeAndTeam = <TData = EventRow[]>(
  eventType: EventType | undefined,
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "type", eventType, "team", teamId],
    queryFn: () => (eventType && teamId ? eventsService.getByTypeAndTeam(supabase, eventType, teamId) : null),
    enabled: !!(eventType && teamId),
    ...options,
  });
};

// Get event with attendance
export const useEventWithAttendance = <TData = any>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["events", eventId, "attendance"],
    queryFn: () => (eventId ? eventsService.getWithAttendance(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  });
};

// Get event with roster
export const useEventWithRoster = <TData = any>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["events", eventId, "roster"],
    queryFn: () => (eventId ? eventsService.getWithRoster(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  });
};

// Create event mutation
export const useCreateEvent = (options?: Omit<UseMutationOptions<EventRow, Error, EventInsert>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<EventRow, Error, EventInsert>({
    mutationFn: (event: EventInsert) => eventsService.create(supabase, event),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["calendars", data.calendar_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendars", data.calendar_id, "events"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update event mutation
export const useUpdateEvent = (
  options?: Omit<UseMutationOptions<EventRow, Error, { eventId: string; updates: EventUpdate }>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<EventRow, Error, { eventId: string; updates: EventUpdate }>({
    mutationFn: ({ eventId, updates }) => eventsService.update(supabase, eventId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["events", variables.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["events", variables.eventId, "attendance"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events", variables.eventId, "roster"],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendars", data.calendar_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendars", data.calendar_id, "events"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete event mutation
export const useDeleteEvent = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (eventId: string) => eventsService.delete(supabase, eventId),
    onSuccess: (data, eventId, context) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
      options?.onSuccess?.(data, eventId, context);
    },
    ...options,
  });
};

export const useAddEventToCalendar = (
  options?: UseMutationOptions<Tables<"events_calendars"> | null, Error, TablesInsert<"events_calendars">>
) => {
  return useMutation<Tables<"events_calendars"> | null, Error, TablesInsert<"events_calendars">>({
    mutationFn: (eventCalendar) => eventsCalendarsService.addEventToCalendar(supabase, eventCalendar),
    ...options,
  });
};

export const useRemoveEventFromCalendar = (options?: UseMutationOptions<boolean, Error, string>) => {
  return useMutation<boolean, Error, string>({
    mutationFn: (eventCalendarId) => eventsCalendarsService.removeEventFromCalendar(supabase, eventCalendarId),
    ...options,
  });
};

export const useEventsByOrganisationId = <TData = EventRow[]>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "organisationId", organisationId],
    queryFn: () => (organisationId ? eventsService.getByOrganisationId(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

export const useEventsByTeamId = <TData = EventRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "teamId", teamId],
    queryFn: () => (teamId ? eventsService.getByTeamId(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

export const useEventsByUserId = <TData = EventRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<EventRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<EventRow[] | null, Error, TData>({
    queryKey: ["events", "userId", userId],
    queryFn: () => (userId ? eventsService.getByUserId(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

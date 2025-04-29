import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { calendarsService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type CalendarRow = Tables<"calendars">
type CalendarInsert = TablesInsert<"calendars">
type CalendarUpdate = TablesUpdate<"calendars">

// Get all calendars
export const useCalendars = <TData = CalendarRow[]>(
  options?: Omit<UseQueryOptions<CalendarRow[], Error, TData>, "queryKey" | "queryFn">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<CalendarRow[], Error, TData>({
    queryKey: ["calendars"],
    queryFn: () => calendarsService.getAll(supabase),
    ...options,
  })
}

// Get calendar by ID
export const useCalendar = <TData = CalendarRow>(
  calendarId: string | undefined,
  options?: Omit<UseQueryOptions<CalendarRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<CalendarRow | null, Error, TData>({
    queryKey: ["calendars", calendarId],
    queryFn: () => (calendarId ? calendarsService.getById(supabase, calendarId) : null),
    enabled: !!calendarId,
    ...options,
  })
}

// Get calendar by team
export const useCalendarByTeam = <TData = CalendarRow>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<CalendarRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<CalendarRow | null, Error, TData>({
    queryKey: ["calendars", "team", teamId],
    queryFn: () => (teamId ? calendarsService.getByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  })
}

// Get calendar by organisation
export const useCalendarByOrganisation = <TData = CalendarRow>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<CalendarRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<CalendarRow | null, Error, TData>({
    queryKey: ["calendars", "organisation", organisationId],
    queryFn: () => (organisationId ? calendarsService.getByOrganisation(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  })
}

// Get calendar with events
export const useCalendarWithEvents = <TData = any>(
  calendarId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any | null, Error, TData>({
    queryKey: ["calendars", calendarId, "events"],
    queryFn: () => (calendarId ? calendarsService.getWithEvents(supabase, calendarId) : null),
    enabled: !!calendarId,
    ...options,
  })
}

// Create calendar mutation
export const useCreateCalendar = (
  options?: Omit<UseMutationOptions<CalendarRow, Error, CalendarInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<CalendarRow, Error, CalendarInsert>({
    mutationFn: (calendar: CalendarInsert) => calendarsService.create(supabase, calendar),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      if (data.team_id) {
        queryClient.invalidateQueries({ queryKey: ["teams", data.team_id] })
        queryClient.invalidateQueries({ queryKey: ["calendars", "team", data.team_id] })
      }
      if (data.organisation_id) {
        queryClient.invalidateQueries({ queryKey: ["organisations", data.organisation_id] })
        queryClient.invalidateQueries({ queryKey: ["calendars", "organisation", data.organisation_id] })
      }
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update calendar mutation
export const useUpdateCalendar = (
  options?: Omit<UseMutationOptions<CalendarRow, Error, { calendarId: string; updates: CalendarUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<CalendarRow, Error, { calendarId: string; updates: CalendarUpdate }>({
    mutationFn: ({ calendarId, updates }) => calendarsService.update(supabase, calendarId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      queryClient.invalidateQueries({ queryKey: ["calendars", variables.calendarId] })
      queryClient.invalidateQueries({ queryKey: ["calendars", variables.calendarId, "events"] })
      if (data.team_id) {
        queryClient.invalidateQueries({ queryKey: ["teams", data.team_id] })
        queryClient.invalidateQueries({ queryKey: ["calendars", "team", data.team_id] })
      }
      if (data.organisation_id) {
        queryClient.invalidateQueries({ queryKey: ["organisations", data.organisation_id] })
        queryClient.invalidateQueries({ queryKey: ["calendars", "organisation", data.organisation_id] })
      }
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete calendar mutation
export const useDeleteCalendar = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (calendarId: string) => calendarsService.delete(supabase, calendarId),
    onSuccess: (data, calendarId, context) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      queryClient.invalidateQueries({ queryKey: ["calendars", calendarId] })
      options?.onSuccess?.(data, calendarId, context)
    },
    ...options,
  })
}

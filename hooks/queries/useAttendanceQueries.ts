import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { attendanceService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type AttendanceRow = Tables<"attendance">
type AttendanceInsert = TablesInsert<"attendance">
type AttendanceUpdate = TablesUpdate<"attendance">

// Get attendance by ID
export const useAttendance = <TData = AttendanceRow>(
  attendanceId: string | undefined,
  options?: Omit<UseQueryOptions<AttendanceRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AttendanceRow | null, Error, TData>({
    queryKey: ["attendance", attendanceId],
    queryFn: () => (attendanceId ? attendanceService.getById(supabase, attendanceId) : null),
    enabled: !!attendanceId,
    ...options,
  })
}

// Get attendance by event
export const useAttendanceByEvent = <TData = any[]>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["attendance", "event", eventId],
    queryFn: () => (eventId ? attendanceService.getByEvent(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  })
}

// Get attendance by player
export const useAttendanceByPlayer = <TData = any[]>(
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["attendance", "player", playerId],
    queryFn: () => (playerId ? attendanceService.getByPlayer(supabase, playerId) : null),
    enabled: !!playerId,
    ...options,
  })
}

// Get player's attendance for an event
export const usePlayerEventAttendance = <TData = AttendanceRow>(
  eventId: string | undefined,
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<AttendanceRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AttendanceRow | null, Error, TData>({
    queryKey: ["attendance", "event", eventId, "player", playerId],
    queryFn: () =>
      eventId && playerId ? attendanceService.getPlayerEventAttendance(supabase, eventId, playerId) : null,
    enabled: !!(eventId && playerId),
    ...options,
  })
}

// Create or update attendance mutation
export const useUpsertAttendance = (
  options?: Omit<UseMutationOptions<AttendanceRow, Error, AttendanceInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<AttendanceRow, Error, AttendanceInsert>({
    mutationFn: (attendance: AttendanceInsert) => attendanceService.upsert(supabase, attendance),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "event", data.event_id] })
      queryClient.invalidateQueries({ queryKey: ["attendance", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["attendance", "event", data.event_id, "player", data.player_id],
      })
      queryClient.invalidateQueries({ queryKey: ["events", data.event_id, "attendance"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update attendance mutation
export const useUpdateAttendance = (
  options?: Omit<
    UseMutationOptions<AttendanceRow, Error, { attendanceId: string; updates: AttendanceUpdate }>,
    "mutationFn"
  >,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<AttendanceRow, Error, { attendanceId: string; updates: AttendanceUpdate }>({
    mutationFn: ({ attendanceId, updates }) => attendanceService.update(supabase, attendanceId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", data.attendance_id] })
      queryClient.invalidateQueries({ queryKey: ["attendance", "event", data.event_id] })
      queryClient.invalidateQueries({ queryKey: ["attendance", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["attendance", "event", data.event_id, "player", data.player_id],
      })
      queryClient.invalidateQueries({ queryKey: ["events", data.event_id, "attendance"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete attendance mutation
export const useDeleteAttendance = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (attendanceId: string) => attendanceService.delete(supabase, attendanceId),
    onSuccess: (data, attendanceId, context) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] })
      queryClient.invalidateQueries({ queryKey: ["events"] })
      options?.onSuccess?.(data, attendanceId, context)
    },
    ...options,
  })
}


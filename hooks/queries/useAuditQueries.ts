import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/browser"
import { auditService } from "@/utils/supabase/services"
import type { Tables, TablesInsert } from "@/utils/database.types"

type AuditLogRow = Tables<"audit_logs">
type AuditLogInsert = TablesInsert<"audit_logs">
type AuditAction = string

// Get audit log by ID
export const useAuditLog = <TData = AuditLogRow>(
  logId: string | undefined,
  options?: Omit<UseQueryOptions<AuditLogRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AuditLogRow | null, Error, TData>({
    queryKey: ["audit", logId],
    queryFn: () => (logId ? auditService.getById(supabase, logId) : null),
    enabled: !!logId,
    ...options,
  })
}

// Get audit logs by user
export const useAuditLogsByUser = <TData = AuditLogRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<AuditLogRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AuditLogRow[] | null, Error, TData>({
    queryKey: ["audit", "user", userId],
    queryFn: () => (userId ? auditService.getByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  })
}

// Get audit logs by action
export const useAuditLogsByAction = <TData = AuditLogRow[]>(
  action: AuditAction | undefined,
  options?: Omit<UseQueryOptions<AuditLogRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AuditLogRow[] | null, Error, TData>({
    queryKey: ["audit", "action", action],
    queryFn: () => (action ? auditService.getByAction(supabase, action) : null),
    enabled: !!action,
    ...options,
  })
}

// Get recent audit logs
export const useRecentAuditLogs = <TData = AuditLogRow[]>(
  limit = 100,
  options?: Omit<UseQueryOptions<AuditLogRow[], Error, TData>, "queryKey" | "queryFn">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AuditLogRow[], Error, TData>({
    queryKey: ["audit", "recent", limit],
    queryFn: () => auditService.getRecent(supabase, limit),
    ...options,
  })
}

// Search audit logs
export const useSearchAuditLogs = <TData = AuditLogRow[]>(
  query: string | undefined,
  startDate?: string,
  endDate?: string,
  limit = 100,
  options?: Omit<UseQueryOptions<AuditLogRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<AuditLogRow[] | null, Error, TData>({
    queryKey: ["audit", "search", query, startDate, endDate, limit],
    queryFn: () => (query ? auditService.search(supabase, query, startDate, endDate, limit) : null),
    enabled: !!query,
    ...options,
  })
}

// Create an audit log mutation
export const useCreateAuditLog = (
  options?: Omit<UseMutationOptions<AuditLogRow, Error, AuditLogInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<AuditLogRow, Error, AuditLogInsert>({
    mutationFn: (log: AuditLogInsert) => auditService.create(supabase, log),
    onSuccess: (data, variables, context) => {
      if (data.user_id) {
        queryClient.invalidateQueries({ queryKey: ["audit", "user", data.user_id] })
      }
      queryClient.invalidateQueries({ queryKey: ["audit", "action", data.action] })
      queryClient.invalidateQueries({ queryKey: ["audit", "recent"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}


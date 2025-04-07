import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert } from "@/utils/database.types"

export type AuditLogRow = Tables<"audit_logs">
export type AuditLogInsert = TablesInsert<"audit_logs">
export type AuditAction = string
export type AuditDetails = Record<string, any>

export const auditService = {
  // Get audit log by ID
  getById: async (supabase: TypedSupabaseClient, logId: string) => {
    const { data, error } = await supabase.from("audit_logs").select("*").eq("log_id", logId).single()

    if (error) throw error
    return data
  },

  // Get audit logs by user
  getByUser: async (supabase: TypedSupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })

    if (error) throw error
    return data
  },

  // Get audit logs by action
  getByAction: async (supabase: TypedSupabaseClient, action: AuditAction) => {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", action)
      .order("timestamp", { ascending: false })

    if (error) throw error
    return data
  },

  // Get recent audit logs
  getRecent: async (supabase: TypedSupabaseClient, limit = 100) => {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Create an audit log
  create: async (supabase: TypedSupabaseClient, log: AuditLogInsert) => {
    const { data, error } = await supabase.from("audit_logs").insert(log).select().single()

    if (error) throw error
    return data
  },

  // Search audit logs
  search: async (supabase: TypedSupabaseClient, query: string, startDate?: string, endDate?: string, limit = 100) => {
    let queryBuilder = supabase.from("audit_logs").select("*").or(`action.ilike.%${query}%,details.ilike.%${query}%`)

    if (startDate) {
      queryBuilder = queryBuilder.gte("timestamp", startDate)
    }

    if (endDate) {
      queryBuilder = queryBuilder.lte("timestamp", endDate)
    }

    const { data, error } = await queryBuilder.order("timestamp", { ascending: false }).limit(limit)

    if (error) throw error
    return data
  },
}


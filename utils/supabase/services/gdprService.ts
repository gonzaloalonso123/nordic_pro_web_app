import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type GdprConsentRow = Tables<"gdpr_consent">
export type GdprConsentInsert = TablesInsert<"gdpr_consent">
export type GdprConsentUpdate = TablesUpdate<"gdpr_consent">

export type ConsentDetails = {
  chat?: boolean
  voting?: boolean
  feedback?: boolean
  photos?: boolean
  [key: string]: boolean | undefined
}

export const gdprService = {
  // Get consent by ID
  getById: async (supabase: TypedSupabaseClient, consentId: string) => {
    const { data, error } = await supabase.from("gdpr_consent").select("*").eq("consent_id", consentId).single()

    if (error) throw error
    return data
  },

  // Get consent by parent and child
  getByParentAndChild: async (supabase: TypedSupabaseClient, parentId: string, childId: string) => {
    const { data, error } = await supabase
      .from("gdpr_consent")
      .select("*")
      .eq("parent_id", parentId)
      .eq("child_id", childId)
      .eq("revoked", false)
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned"
    return data
  },

  // Get consents by parent
  getByParent: async (supabase: TypedSupabaseClient, parentId: string) => {
    const { data, error } = await supabase
      .from("gdpr_consent")
      .select(`
        *,
        child:child_id(user_id, full_name)
      `)
      .eq("parent_id", parentId)
      .eq("revoked", false)

    if (error) throw error
    return data
  },

  // Get consents by child
  getByChild: async (supabase: TypedSupabaseClient, childId: string) => {
    const { data, error } = await supabase
      .from("gdpr_consent")
      .select(`
        *,
        parent:parent_id(user_id, full_name)
      `)
      .eq("child_id", childId)
      .eq("revoked", false)

    if (error) throw error
    return data
  },

  // Create consent
  create: async (supabase: TypedSupabaseClient, consent: GdprConsentInsert) => {
    const { data, error } = await supabase.from("gdpr_consent").insert(consent).select().single()

    if (error) throw error
    return data
  },

  // Update consent
  update: async (supabase: TypedSupabaseClient, consentId: string, updates: GdprConsentUpdate) => {
    const { data, error } = await supabase
      .from("gdpr_consent")
      .update(updates)
      .eq("consent_id", consentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Revoke consent
  revoke: async (supabase: TypedSupabaseClient, consentId: string) => {
    const { data, error } = await supabase
      .from("gdpr_consent")
      .update({
        revoked: true,
        revoked_date: new Date().toISOString(),
      })
      .eq("consent_id", consentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Check if a specific consent is given
  checkSpecificConsent: async (supabase: TypedSupabaseClient, childId: string, consentType: keyof ConsentDetails) => {
    const { data, error } = await supabase
      .from("gdpr_consent")
      .select("consent_details")
      .eq("child_id", childId)
      .eq("revoked", false)
      .eq("consent_given", true)

    if (error) throw error

    if (data.length === 0) return false

    // Check if any parent has given this specific consent
    return data.some((item) => {
      const details = item.consent_details as ConsentDetails
      return details[consentType] === true
    })
  },
}


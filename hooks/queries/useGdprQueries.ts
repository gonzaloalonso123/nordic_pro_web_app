import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { gdprService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type GdprConsentRow = Tables<"gdpr_consent">
type GdprConsentInsert = TablesInsert<"gdpr_consent">
type GdprConsentUpdate = TablesUpdate<"gdpr_consent">

type ConsentDetails = {
  chat?: boolean
  voting?: boolean
  feedback?: boolean
  photos?: boolean
  [key: string]: boolean | undefined
}

// Get consent by ID
export const useConsent = <TData = GdprConsentRow>(
  consentId: string | undefined,
  options?: Omit<UseQueryOptions<GdprConsentRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<GdprConsentRow | null, Error, TData>({
    queryKey: ["gdpr", consentId],
    queryFn: () => (consentId ? gdprService.getById(supabase, consentId) : null),
    enabled: !!consentId,
    ...options,
  })
}

// Get consent by parent and child
export const useConsentByParentAndChild = <TData = GdprConsentRow>(
  parentId: string | undefined,
  childId: string | undefined,
  options?: Omit<UseQueryOptions<GdprConsentRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<GdprConsentRow | null, Error, TData>({
    queryKey: ["gdpr", "parent", parentId, "child", childId],
    queryFn: () => (parentId && childId ? gdprService.getByParentAndChild(supabase, parentId, childId) : null),
    enabled: !!(parentId && childId),
    ...options,
  })
}

// Get consents by parent
export const useConsentsByParent = <TData = any[]>(
  parentId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["gdpr", "parent", parentId],
    queryFn: () => (parentId ? gdprService.getByParent(supabase, parentId) : null),
    enabled: !!parentId,
    ...options,
  })
}

// Get consents by child
export const useConsentsByChild = <TData = any[]>(
  childId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["gdpr", "child", childId],
    queryFn: () => (childId ? gdprService.getByChild(supabase, childId) : null),
    enabled: !!childId,
    ...options,
  })
}

// Check if a specific consent is given
export const useCheckSpecificConsent = <TData = boolean>(
  childId: string | undefined,
  consentType: keyof ConsentDetails | undefined,
  options?: Omit<UseQueryOptions<boolean | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<boolean | null, Error, TData>({
    queryKey: ["gdpr", "child", childId, "consent", consentType],
    queryFn: () => (childId && consentType ? gdprService.checkSpecificConsent(supabase, childId, consentType) : null),
    enabled: !!(childId && consentType),
    ...options,
  })
}

// Create consent mutation
export const useCreateConsent = (
  options?: Omit<UseMutationOptions<GdprConsentRow, Error, GdprConsentInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<GdprConsentRow, Error, GdprConsentInsert>({
    mutationFn: (consent: GdprConsentInsert) => gdprService.create(supabase, consent),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["gdpr", "parent", data.parent_id] })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "child", data.child_id] })
      queryClient.invalidateQueries({
        queryKey: ["gdpr", "parent", data.parent_id, "child", data.child_id],
      })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "child", data.child_id, "consent"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update consent mutation
export const useUpdateConsent = (
  options?: Omit<
    UseMutationOptions<GdprConsentRow, Error, { consentId: string; updates: GdprConsentUpdate }>,
    "mutationFn"
  >,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<GdprConsentRow, Error, { consentId: string; updates: GdprConsentUpdate }>({
    mutationFn: ({ consentId, updates }) => gdprService.update(supabase, consentId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["gdpr", data.consent_id] })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "parent", data.parent_id] })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "child", data.child_id] })
      queryClient.invalidateQueries({
        queryKey: ["gdpr", "parent", data.parent_id, "child", data.child_id],
      })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "child", data.child_id, "consent"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Revoke consent mutation
export const useRevokeConsent = (options?: Omit<UseMutationOptions<GdprConsentRow, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<GdprConsentRow, Error, string>({
    mutationFn: (consentId: string) => gdprService.revoke(supabase, consentId),
    onSuccess: (data, consentId, context) => {
      queryClient.invalidateQueries({ queryKey: ["gdpr", data.consent_id] })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "parent", data.parent_id] })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "child", data.child_id] })
      queryClient.invalidateQueries({
        queryKey: ["gdpr", "parent", data.parent_id, "child", data.child_id],
      })
      queryClient.invalidateQueries({ queryKey: ["gdpr", "child", data.child_id, "consent"] })
      options?.onSuccess?.(data, consentId, context)
    },
    ...options,
  })
}


import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/browser"
import { usersService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type UserRow = Tables<"users">
type UserInsert = TablesInsert<"users">
type UserUpdate = TablesUpdate<"users">
type UserRole = "player" | "coach" | "parent" | "admin"

// Get all users
export const useUsers = <TData = UserRow[]>(
  options?: Omit<UseQueryOptions<UserRow[], Error, TData>, "queryKey" | "queryFn">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[], Error, TData>({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(supabase),
    ...options,
  })
}

// Get user by ID
export const useUser = <TData = UserRow>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow | null, Error, TData>({
    queryKey: ["users", userId],
    queryFn: () => (userId ? usersService.getById(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  })
}

// Get user by email
export const useUserByEmail = <TData = UserRow>(
  email: string | undefined,
  options?: Omit<UseQueryOptions<UserRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow | null, Error, TData>({
    queryKey: ["users", "email", email],
    queryFn: () => (email ? usersService.getByEmail(supabase, email) : null),
    enabled: !!email,
    ...options,
  })
}

// Get users by role
export const useUsersByRole = <TData = UserRow[]>(
  role: UserRole | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", "role", role],
    queryFn: () => (role ? usersService.getByRole(supabase, role) : null),
    enabled: !!role,
    ...options,
  })
}

// Get users by team
export const useUsersByTeam = <TData = UserRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", "team", teamId],
    queryFn: () => (teamId ? usersService.getByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  })
}

// Get players by team
export const usePlayersByTeam = <TData = UserRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", "players", teamId],
    queryFn: () => (teamId ? usersService.getPlayersByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  })
}

// Get coaches by team
export const useCoachesByTeam = <TData = UserRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", "coaches", teamId],
    queryFn: () => (teamId ? usersService.getCoachesByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  })
}

// Get children of a parent
export const useChildren = <TData = UserRow[]>(
  parentId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", parentId, "children"],
    queryFn: () => (parentId ? usersService.getChildren(supabase, parentId) : null),
    enabled: !!parentId,
    ...options,
  })
}

// Get parents of a child
export const useParents = <TData = UserRow[]>(
  childId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", childId, "parents"],
    queryFn: () => (childId ? usersService.getParents(supabase, childId) : null),
    enabled: !!childId,
    ...options,
  })
}

// Create user mutation
export const useCreateUser = (options?: Omit<UseMutationOptions<UserRow, Error, UserInsert>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<UserRow, Error, UserInsert>({
    mutationFn: (user: UserInsert) => usersService.create(supabase, user),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", "role", data.role] })
      if (data.team_id) {
        queryClient.invalidateQueries({ queryKey: ["users", "team", data.team_id] })
        queryClient.invalidateQueries({ queryKey: ["teams", data.team_id, "members"] })
      }
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update user mutation
export const useUpdateUser = (
  options?: Omit<UseMutationOptions<UserRow, Error, { userId: string; updates: UserUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<UserRow, Error, { userId: string; updates: UserUpdate }>({
    mutationFn: ({ userId, updates }) => usersService.update(supabase, userId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] })
      queryClient.invalidateQueries({ queryKey: ["users", "role", data.role] })

      if (data.team_id) {
        queryClient.invalidateQueries({ queryKey: ["users", "team", data.team_id] })
        queryClient.invalidateQueries({ queryKey: ["teams", data.team_id, "members"] })
      }
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete user mutation
export const useDeleteUser = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (userId: string) => usersService.delete(supabase, userId),
    onSuccess: (data, userId, context) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", userId] })
      options?.onSuccess?.(data, userId, context)
    },
    ...options,
  })
}

// Add parent-child relationship mutation
export const useAddParentChild = (
  options?: Omit<UseMutationOptions<any, Error, { parentId: string; childId: string }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<any, Error, { parentId: string; childId: string }>({
    mutationFn: ({ parentId, childId }) => usersService.addParentChild(supabase, parentId, childId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.parentId, "children"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.childId, "parents"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Remove parent-child relationship mutation
export const useRemoveParentChild = (
  options?: Omit<UseMutationOptions<boolean, Error, { parentId: string; childId: string }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, { parentId: string; childId: string }>({
    mutationFn: ({ parentId, childId }) => usersService.removeParentChild(supabase, parentId, childId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.parentId, "children"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.childId, "parents"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}


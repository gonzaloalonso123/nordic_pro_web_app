import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { usersService } from "@/utils/supabase/services";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type UserRow = Tables<"users">;
type UserInsert = TablesInsert<"users">;
type UserUpdate = TablesUpdate<"users">;

// Get all users
export const useUsers = <TData = UserRow[]>(
  options?: Omit<UseQueryOptions<UserRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<UserRow[], Error, TData>({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(supabase),
    ...options,
  });
};

// Get user by ID
export const useUser = <TData = UserRow>(
  userId: string | undefined | null,
  options?: Omit<UseQueryOptions<UserRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<UserRow | null, Error, TData>({
    queryKey: ["users", userId],
    queryFn: () => (userId ? usersService.getById(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

export const useUserByIds = <TData = UserRow[]>(
  userIds: string[] | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", userIds],
    queryFn: () => (userIds ? usersService.getByIds(supabase, userIds) : null),
    enabled: !!userIds,
    ...options,
  });
};

// Get users by organisation
export const useUsersByOrganisation = <TData = UserRow[]>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", "organisation", organisationId],
    queryFn: () => (organisationId ? usersService.getByOrganisation(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

// Get users by team
export const useUsersByTeam = <TData = UserRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<UserRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<UserRow[] | null, Error, TData>({
    queryKey: ["users", "team", teamId],
    queryFn: () => (teamId ? usersService.getByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get user with teams
export const useUserWithTeams = <TData = any>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["users", userId, "teams"],
    queryFn: () => (userId ? usersService.getWithTeams(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

// Get user with organisations
export const useUserWithOrganisations = <TData = any>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["users", userId, "organisations"],
    queryFn: () => (userId ? usersService.getWithOrganisations(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

// Create user mutation
export const useCreateUser = (options?: Omit<UseMutationOptions<UserRow, Error, UserInsert>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<UserRow, Error, UserInsert>({
    mutationFn: (user: UserInsert) => usersService.create(supabase, user),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update user mutation
export const useUpdateUser = (
  options?: Omit<UseMutationOptions<UserRow, Error, { userId: string; updates: UserUpdate }>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<UserRow, Error, { userId: string; updates: UserUpdate }>({
    mutationFn: ({ userId, updates }) => usersService.update(supabase, userId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.userId, "teams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.userId, "organisations"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Soft delete user mutation
export const useSoftDeleteUser = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (userId: string) => usersService.softDelete(supabase, userId),
    onSuccess: (data, userId, context) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      options?.onSuccess?.(data, userId, context);
    },
    ...options,
  });
};

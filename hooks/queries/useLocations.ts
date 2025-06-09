import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { locationsService } from "@/utils/supabase/services";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type LocationRow = Tables<"locations">;
type LocationInsert = TablesInsert<"locations">;
type LocationUpdate = TablesUpdate<"locations">;

// Get all locations
export const useLocations = <TData = LocationRow[]>(
  options?: Omit<UseQueryOptions<LocationRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<LocationRow[], Error, TData>({
    queryKey: ["locations"],
    queryFn: () => locationsService.getAll(supabase),
    ...options,
  });
};

// Get location by ID
export const useLocation = <TData = LocationRow>(
  locationId: string | undefined,
  options?: Omit<UseQueryOptions<LocationRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<LocationRow | null, Error, TData>({
    queryKey: ["locations", locationId],
    queryFn: () => (locationId ? locationsService.getById(supabase, locationId) : null),
    enabled: !!locationId,
    ...options,
  });
};

// Get locations by organisation
export const useLocationsByOrganisation = <TData = LocationRow[]>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<LocationRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<LocationRow[] | null, Error, TData>({
    queryKey: ["locations", "organisation", organisationId],
    queryFn: () => (organisationId ? locationsService.getByOrganisation(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

// Create location mutation
export const useCreateLocation = (
  options?: Omit<UseMutationOptions<LocationRow, Error, LocationInsert>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<LocationRow, Error, LocationInsert>({
    mutationFn: (location: LocationInsert) => locationsService.create(supabase, location),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update location mutation
export const useUpdateLocation = (
  options?: Omit<UseMutationOptions<LocationRow, Error, { locationId: string; updates: LocationUpdate }>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<LocationRow, Error, { locationId: string; updates: LocationUpdate }>({
    mutationFn: ({ locationId, updates }) => locationsService.update(supabase, locationId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({
        queryKey: ["locations", variables.locationId],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete location mutation
export const useDeleteLocation = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (locationId: string) => locationsService.delete(supabase, locationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

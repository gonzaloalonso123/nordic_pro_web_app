"use client";

import { useState } from "react";
import type { Location } from "../types";
import {
  useLocationsByOrganisation,
  useCreateLocation,
} from "@/hooks/queries/useLocations";
import type { Tables, TablesInsert } from "@/types/database.types";

type LocationRow = Tables<"locations">;
type LocationInsert = TablesInsert<"locations">;

export function useLocationApi(organisationId: string) {
  const [error, setError] = useState<string | null>(null);

  const {
    data: recentLocations = [],
    isLoading: loading,
    refetch,
  } = useLocationsByOrganisation(organisationId, {
    onError: (err) => {
      setError(err.message);
      console.error("Error fetching locations:", err);
    },
  });

  const createLocationMutation = useCreateLocation({
    onError: (err) => {
      setError(err.message);
      console.error("Error creating location:", err);
    },
  });

  // Add new location
  const addLocation = async (
    location: Omit<Location, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const locationInsert: LocationInsert = {
        id: crypto.randomUUID(),
        name: location.name,
        coordinates: location.coordinates,
        organisation_id: location.organisation_id,
      };

      const newLocation =
        await createLocationMutation.mutateAsync(locationInsert);

      // Return the new location
      return newLocation as unknown as Location;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  return {
    recentLocations: (recentLocations as Location[]) || [],
    loading,
    error,
    addLocation,
    refetch,
  };
}

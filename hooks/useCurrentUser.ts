"use client";

import { useQuery } from "@tanstack/react-query";
import { useClientData } from "@/utils/data/client";
import { Tables } from "@/types/database.types";
import { useState, useEffect } from "react";

export function useCurrentUser() {
  const { auth, users } = useClientData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<Tables<"users"> | null>(null);

  const {
    data: authUser,
    isLoading: isAuthLoading,
    error: authError,
  } = useQuery({
    queryKey: ["currentAuthUser"],
    queryFn: auth.getCurrentUser,
  });

  const { data: profile, isPending: isDbLoading } = users.useById(authUser?.id);

  useEffect(() => {
    if (authError) {
      setError(
        authError instanceof Error
          ? authError
          : new Error("Failed to fetch user")
      );
      setIsLoading(false);
    } else if (!isAuthLoading && !isDbLoading) {
      setUser(profile || null);
      setIsLoading(false);
    }
  }, [authUser, profile, isAuthLoading, isDbLoading, authError]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!authUser && !!profile,
  };
}

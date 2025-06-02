"use client";

import React, { createContext, useContext, useState } from 'react';

interface LoadingContextType {
  isNavigating: boolean;
  setIsNavigating: (loading: boolean) => void;
  loadingPath: string | null;
  setLoadingPath: (path: string | null) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  return (
    <LoadingContext.Provider value={{
      isNavigating,
      setIsNavigating,
      loadingPath,
      setLoadingPath
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}


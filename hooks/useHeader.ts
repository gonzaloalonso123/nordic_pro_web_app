"use client";

import { HeaderContext } from '@/contexts/HeaderContext';
import { useContext, useEffect, useCallback, type DependencyList, type ReactNode } from 'react';

interface HeaderConfig {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

export const useHeader = () => {
  const context = useContext(HeaderContext);

  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderContextProvider');
  }

  const setHeaderConfigWithCleanup = useCallback((config: HeaderConfig) => {
    context.setHeaderConfig(config);

    return () => {
      context.setHeaderConfig({
        leftContent: undefined,
        centerContent: undefined,
        rightContent: undefined,
      });
    };
  }, [context.setHeaderConfig]);

  const useHeaderConfig = useCallback((config: HeaderConfig, deps: DependencyList = []) => {
    useEffect(() => {
      context.setHeaderConfig(config);

      return () => {
        context.setHeaderConfig({
          leftContent: undefined,
          centerContent: undefined,
          rightContent: undefined,
        });
      };
    }, deps);
  }, [context.setHeaderConfig]);

  return {
    ...context,
    setHeaderConfigWithCleanup,
    useHeaderConfig,
  };
};

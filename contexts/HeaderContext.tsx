"use client";

import { createContext, useState, ReactNode, Dispatch, SetStateAction, useMemo } from 'react';

interface HeaderConfig {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

interface HeaderContextType {
  headerConfig: HeaderConfig;
  setHeaderConfig: Dispatch<SetStateAction<HeaderConfig>>;
}

const defaultState: HeaderContextType = {
  headerConfig: {},
  setHeaderConfig: () => {},
};

export const HeaderContext = createContext<HeaderContextType>(defaultState);

interface HeaderContextProviderProps {
  children: ReactNode;
}

export const HeaderContextProvider: React.FC<HeaderContextProviderProps> = ({ children }) => {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(defaultState.headerConfig);

  const contextValue = useMemo(() => ({
    headerConfig,
    setHeaderConfig
  }), [headerConfig]);

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
};

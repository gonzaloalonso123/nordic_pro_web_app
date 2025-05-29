"use client";

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

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
  headerConfig: { isNativeHeader: false },
  setHeaderConfig: () => {},
};

export const HeaderContext = createContext<HeaderContextType>(defaultState);

interface HeaderContextProviderProps {
  children: ReactNode;
}

export const HeaderContextProvider: React.FC<HeaderContextProviderProps> = ({ children }) => {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(defaultState.headerConfig);

  return (
    <HeaderContext.Provider value={{ headerConfig, setHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

"use client";

import { createContext, useContext } from "react";

const teamRoleContext = createContext({
  app: {
    role: "GUEST",
  },
  team: { role: "GUEST", id: "" },
  organisation: { role: "GUEST", id: "" },
});

export const useRole = () => {
  const { app, team, organisation } = useContext(teamRoleContext);
  return {
    app,
    team,
    organisation,
  };
};

export const RoleProvider = ({
  children,
  app,
  team,
  organisation,
}: {
  children: React.ReactNode;
  app: {
    role: string;
  };
  team: {
    role: string;
    id: string;
  };
  organisation: {
    role: string;
    id: string;
  };
}) => {
  return (
    <teamRoleContext.Provider value={{ app, team, organisation }}>
      {children}
    </teamRoleContext.Provider>
  );
};

"use server";

import { serverData } from "./data/server";

const defaultTeam = {
  id: null,
  role: "USER",
  isManager: false,
};
const defaultOrganisation = {
  id: null,
  role: "USER",
};

export const getUserRoles = async () => {
  const user = await serverData.auth.getCurrentDBUser();
  let app = { role: user?.is_admin ? "ADMIN" : "USER" };

  if (!user) {
    return {
      app,
      team: defaultTeam,
      organisation: defaultOrganisation,
    };
  }

  const organisation = await getUserOrganisation(user.id);
  const team = await getUserTeam(user.id);

  return {
    app,
    team: team || defaultTeam,
    organisation: organisation || defaultOrganisation,
  };
};

export const getRootUrl = async () => {
  const { app, organisation, team } = await getUserRoles();
  return app.role === "ADMIN"
    ? "/admin"
    : organisation.role === "MANAGER"
      ? `/organisation/${organisation.id}`
      : `/team/${team.id}`;
};

const getUserOrganisation = async (userId: string) => {
  const userWithOrganisations = await serverData.users.getWithOrganisations(userId);
  if (userWithOrganisations.users_organisations.length > 0) {
    const selectedOrganisation = userWithOrganisations.users_organisations[0];
    return {
      role: selectedOrganisation.role,
      id: selectedOrganisation.organisations.id,
    };
  }
};

const getUserTeam = async (userId: string) => {
  const userWithTeams = await serverData.users.getWithTeams(userId);
  if (userWithTeams.users_teams.length > 0) {
    const selectedTeam = userWithTeams.users_teams[0];
    return {
      role: selectedTeam.role,
      id: selectedTeam.teams.id,
      isManager: selectedTeam.team_manager === userId,
    };
  }
};

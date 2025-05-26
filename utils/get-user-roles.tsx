"use server";

import { serverData } from "./data/server";

export const getUserRoles = async () => {
  const user = await serverData.auth.getCurrentDBUser();
  let app = { role: "USER" };
  let organisation = {
    role: "USER",
    id: "",
  };
  let team = {
    role: "USER",
    id: "",
  };
  if (user) {
    if (user.is_admin) {
      app.role = "ADMIN";
    }
    const userWithOrganisations = await serverData.users.getWithOrganisations(
      user.id
    );
    if (userWithOrganisations.users_organisations.length > 0) {
      const selectedOrganisation = userWithOrganisations.users_organisations[0];
      organisation = {
        role: selectedOrganisation.role,
        id: selectedOrganisation.organisations.id,
      };
    }
    const userWithTeams = await serverData.users.getWithTeams(user.id);
    if (userWithTeams.users_teams.length > 0) {
      const selectedTeam = userWithTeams.users_teams[0];
      team = {
        role: selectedTeam.role,
        id: selectedTeam.teams.id,
      };
    }
  }
  return {
    app,
    team,
    organisation,
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

import { useRole } from "@/app/app/(role-provider)/role-provider";
import flags from "@/flags.json";
const root = flags.current_app;

export const useUrl = () => {
  const { app, organisation, team } = useRole();
  return app.role === "ADMIN"
    ? `${root}/admin`
    : organisation.role === "MANAGER"
      ? `${root}/organisation/${organisation.id}`
      : `${root}/team/${team.id}`;
};

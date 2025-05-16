import { useRole } from "@/app/app/(role-provider)/role-provider";
import flags from "@/flags.json";
const root = flags.current_app;

export const useUrl = () => {
  const { app, organisation, team } = useRole();
  const rootUrl = root;
  return app.role === "ADMIN"
    ? `${rootUrl}/admin`
    : organisation.role === "MANAGER"
      ? `${rootUrl}/organisation/${organisation.id}`
      : `${rootUrl}/team/${team.id}`;
};

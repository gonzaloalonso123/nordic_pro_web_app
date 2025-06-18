import { redirect } from "next/navigation";
import { getUserRoles } from "@/utils/get-user-roles";

const DEFAULT_COACH_URL = "/calendar";
const DEFAULT_USER_URL = "/dashboard";

const Page = async () => {
  const { app, organisation, team } = await getUserRoles();
  if (app.role === "ADMIN") {
    redirect("/app/admin");
  }
  if (organisation.role === "MANAGER") {
    redirect(`/app/organisation/${organisation.id}`);
  }
  if (team.role === "COACH") {
    redirect(`/app/team/${team.id}${DEFAULT_COACH_URL}`);
  }
  if (team.role === "PLAYER") {
    redirect(`/app/team/${team.id}${DEFAULT_USER_URL}`);
  }

  return <div>No authorisation retrieved. Get in touch with the administrator of your organisation.</div>;
};

export default Page;

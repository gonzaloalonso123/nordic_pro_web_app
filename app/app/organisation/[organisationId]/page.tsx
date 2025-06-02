import { serverData } from "@/utils/data/server";
import flags from "@/flags.json";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/types/database.types";
import { Settings, Layers, Plus } from "lucide-react";
import { OrganisationPageAnalytics } from "./components/organisation-page-analytics";
import { MembersSection } from "./components/members-section";
import { Content } from "@/components/content";
import { LoadingLink } from "@/components/ui/loading-link";

type PageProps = {
  params: Promise<{
    organisationId: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const organisationId = params.organisationId;
  const teams = await serverData.teams.getByOrganisation(organisationId);
  const members = await serverData.users.getByOrganisation(organisationId);

  return (
    <Content>
      <OrganisationPageAnalytics organisationId={organisationId} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Layers className="mr-2 h-5 w-5" />
              Teams
            </h2>
            <LoadingLink
              variant="sport"
              size="sm"
              className="flex gap-2 items-center"
              href={`${flags.current_app}/organisation/${organisationId}/add-team`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </LoadingLink>
          </div>

          <div className="space-y-3">
            {teams.length > 0 ? (
              teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  organisationId={organisationId}
                />
              ))
            ) : (
              <Card className="p-4 text-center text-muted-foreground">
                No teams found
              </Card>
            )}
          </div>
        </section>

        <MembersSection organisationId={organisationId} members={members} />
      </div>
    </Content>
  );
};

const TeamCard = ({
  team,
  organisationId,
}: {
  team: Tables<"teams">;
  organisationId: string;
}) => {
  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base">{team.name}</CardTitle>
        <LoadingLink
          href={`${flags.current_app}/organisation/${organisationId}/teams/${team.id}`}
          className="flex gap-2 items-center"
        >
          <Settings className="h-4 w-4" />
          Manage
        </LoadingLink>
      </CardHeader>
    </Card>
  );
};

export default Page;

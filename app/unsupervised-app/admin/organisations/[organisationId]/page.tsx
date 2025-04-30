import { Button } from "@/components/ui/button";
import { serverData } from "@/utils/data/server";
import Link from "next/link";
import flags from "@/flags.json";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/utils/database.types";
import { Settings, Layers, Plus } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { OrganisationPageAnalytics } from "./components/organisation-page-analytics";
import { MembersSection } from "./components/members-section";

interface PageProps {
  params: {
    organisationId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const organisationId = params.organisationId;

  const organisation = await serverData.organisations.getById(organisationId);
  const teams = await serverData.teams.getByOrganisation(organisationId);
  const members = await serverData.users.getByOrganisation(organisationId);

  if (!organisation) {
    return (
      <Disclaimer
        variant="error"
        title="Organisation not found"
        description="The organisation you are trying to access does not exist."
      />
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              className="p-2"
              src="/organisation_placeholder.png"
              alt={organisation.name}
            />
          </Avatar>
          {organisation.name}
        </h1>
        <Button asChild variant="outline">
          <Link
            href={`${flags.current_app}/admin/organisations/${organisationId}/settings`}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
      <OrganisationPageAnalytics organisationId={organisationId} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Layers className="mr-2 h-5 w-5" />
              Teams
            </h2>
            <Button variant="sport" asChild size="sm">
              <Link
                className="flex gap-2 items-center"
                href={`${flags.current_app}/admin/organisations/${organisationId}/add-team`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {teams.length > 0 ? (
              teams.map((team) => <TeamCard key={team.id} team={team} />)
            ) : (
              <Card className="p-4 text-center text-muted-foreground">
                No teams found
              </Card>
            )}
          </div>
        </section>

        <MembersSection organisationId={organisationId} members={members} />
      </div>
    </div>
  );
};

const TeamCard = ({ team }: { team: Tables<"teams"> }) => {
  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base">{team.name}</CardTitle>
        <Button variant="link" size="sm" asChild>
          <Link
            href={`${flags.current_app}/admin/teams/${team.id}`}
            className="flex gap-2 items-center"
          >
            <Settings className="h-4 w-4" />
            Manage
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
};

export default Page;

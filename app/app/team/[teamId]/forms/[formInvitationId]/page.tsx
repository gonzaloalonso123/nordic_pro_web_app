"use client";

import { useClientData } from "@/utils/data/client";
import TeamFormVisualization from "../components/team-form-visualisation";
import { useParams } from "next/navigation";
import { Content } from "@/components/content";

export default function Page() {
  const params = useParams();
  const teamId = params.teamId as string;
  const formInvitationId = params.formInvitationId as string;
  const {
    data: sentFormInvitations,
    isPending: sentFormsPending,
    isError,
  } = useClientData().formInvitations.useByTeam(teamId);
  if (sentFormsPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  const current = sentFormInvitations?.find(
    (invitation) => invitation.id === formInvitationId
  );

  console.log(sentFormInvitations, formInvitationId);
  if (!current) {
    return <div>Form not found</div>;
  }

  return (
    <Content>
      <TeamFormVisualization data={current} />
    </Content>
  );
}

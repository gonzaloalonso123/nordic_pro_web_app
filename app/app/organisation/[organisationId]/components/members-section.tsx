"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from "@/types/database.types";
import flags from "@/flags.json";
import { Clock, Plus, Settings, Users, X } from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { LoadingLink, } from "@/components/ui/loading-link";

interface MembersSectionProps {
  organisationId: string;
  members: Tables<"users">[];
}

export function MembersSection({
  organisationId,
  members,
}: MembersSectionProps) {
  const {
    data: invitations,
    isPending,
    isError,
  } = useClientData().organisationsInvitation.useByOrganisation(organisationId);
  const removeInvitation = useClientData().organisationsInvitation.useReject();

  const handleCancelInvitation = (id: string) => {
    removeInvitation.mutate(id);
  };

  if (isPending || isError) {
    return "loading...";
  }

  return (
    <section>
      <Tabs defaultValue="members" className="w-full">
        <div className="flex justify-between xl:items-center mb-4">
          <div className="flex xl:items-center flex-col xl:flex-row gap-5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="mr-2 h-5 w-5" />
              Members
            </h2>
            <TabsList>
              <TabsTrigger value="members">
                Members ({members.length})
              </TabsTrigger>
              <TabsTrigger value="invitations">
                Invitations ({invitations?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>
          <LoadingLink
            variant="sport"
            size="sm"
            className="flex gap-2 items-center"
            href={`${flags.current_app}/organisation/${organisationId}/add-member`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add new
          </LoadingLink>
        </div>

        <TabsContent value="members" className="space-y-3">
          {members.length > 0 ? (
            members.map((member) => (
              <MemberCard key={member.id} member={member} organisationId={organisationId} />
            ))
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No members found
            </Card>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="space-y-3">
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onCancel={() => handleCancelInvitation(invitation.id)}
              />
            ))
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No pending invitations
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

const MemberCard = ({ member, organisationId }: { member: Tables<"users">, organisationId: Tables<"organisations">['id'] }) => {
  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">
            {member.first_name} {member.last_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{member.email}</p>
        </div>
        <LoadingLink
          href={`${flags.current_app}/organisation/${organisationId}/members/${member.id}`}
          className="flex gap-2 items-center"
        >
          <Settings className="h-4 w-4" />
          Manage
        </LoadingLink>
      </CardHeader>
    </Card>
  );
};

const InvitationCard = ({
  invitation,
  onCancel,
}: {
  invitation: Tables<"organisations_invitation">;
  onCancel: () => void;
}) => {
  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">{invitation.user_email}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              Sent: {new Date(invitation.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

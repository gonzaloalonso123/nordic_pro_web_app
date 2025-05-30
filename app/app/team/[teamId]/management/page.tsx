"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Content } from "@/components/content";
import { MembersTable } from "./components/members-table";
import { AddMemberDialog } from "./components/add-member-dialog";
import { useHeader } from "@/hooks/useHeader";
import { MembersTableLoadingVariants } from "./components/members-table-skeleton";
import { useUrl } from "@/hooks/use-url";

export default function ManagementPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { toast } = useToast();
  const path = useUrl();
  const { useHeaderConfig } = useHeader();
  useHeaderConfig({
    centerContent: "Team",
    rightContent: (
      <Button onClick={() => setIsAddDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Add Member</span>
        <span className="sm:hidden">Add</span>
      </Button>
    ),
  });
  const router = useRouter();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const clientData = useClientData();
  const { data: team, isPending } = clientData.teams.useWithUsers(teamId);

  const handleViewDetails = (member: any) => {
    router.push(`${path}/management/${member.user.id}`);
  };

  const handleAddWithEmail = (email: string) => {
    console.log("Adding member with email:", email);
    toast({
      title: "Email Sent",
      description: `Invitation sent to ${email}`,
    });
  };

  const teamMembers = team?.users || [];

  return (
    <Content>
      <Card className="overflow-hidden">
        {isPending ? (
          <MembersTableLoadingVariants variant="detailed" />
        ) : (
          <MembersTable
            members={teamMembers}
            isLoading={false}
            onViewDetails={handleViewDetails}
          />
        )}
      </Card>
      <AddMemberDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        teamId={teamId}
        onAddWithEmail={handleAddWithEmail}
      />
    </Content>
  );
}

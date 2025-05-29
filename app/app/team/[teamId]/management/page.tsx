"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Content } from "@/components/content";
import { MembersTable } from "./components/members-table";
import { AddMemberDialog } from "./components/add-member-dialog";
import { MemberDetailsSheet } from "./components/member-details-sheet";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";

export default function ManagementPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);

  const clientData = useClientData();
  const { data: team, isLoading } = clientData.teams.useWithUsers(teamId);
  const removeUserFromTeam = clientData.teams.useRemoveMember();

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeUserFromTeam.mutateAsync({
        teamId,
        userId,
      });
      toast({
        title: "Success",
        description: "Member removed from team successfully",
      });

      if (selectedMember?.id === userId) {
        setSelectedMember(null);
      }
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error removing member from team:", error);
      toast({
        title: "Error",
        description: "Failed to remove member from team",
        variant: "destructive",
      });
    }
  };

  const handleAddWithEmail = (email: string) => {
    console.log("Adding member with email:", email);
    // Your existing email functionality here
    toast({
      title: "Email Sent",
      description: `Invitation sent to ${email}`,
    });
  };

  const teamMembers = team?.users || [];

  return (
    <Content>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team roster</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <MembersTable
              members={teamMembers}
              isLoading={isLoading}
              onViewDetails={setSelectedMember}
              onRemove={setMemberToDelete}
            />
          </CardContent>
        </Card>

        <AddMemberDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          teamId={teamId}
          onAddWithEmail={handleAddWithEmail}
        />

        <MemberDetailsSheet
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onRemove={setMemberToDelete}
        />

        <DeleteConfirmationDialog
          member={memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={() =>
            memberToDelete && handleRemoveMember(memberToDelete.user.id)
          }
        />
      </div>
    </Content>
  );
}

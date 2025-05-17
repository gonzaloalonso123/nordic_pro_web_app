"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PlusCircle,
  Trash2,
  BarChart,
  User,
  Briefcase,
  Shield,
} from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Content } from "@/components/content";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ManagementPage() {
  const { user } = useCurrentUser();
  const params = useParams();
  const teamId = params.teamId as string;
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    role: "PLAYER",
  });

  // Use client data hooks
  const clientData = useClientData();
  const { data: team, isLoading } = clientData.teams.useWithUsers(teamId);
  const addUserToTeam = clientData.teams.useAddMember();
  const removeUserFromTeam = clientData.teams.useRemoveMember();

  const handleAddMember = async () => {
    if (newMember.name && newMember.position) {
      // Implementation would go here
    }
  };

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
    } catch (error) {
      console.error("Error removing member from team:", error);
      toast({
        title: "Error",
        description: "Failed to remove member from team",
        variant: "destructive",
      });
    }
  };

  const teamMembers = team?.users || [];

  // Helper function to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "COACH":
        return "default";
      case "LEADER":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Content>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team roster</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Member</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new team member.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newMember.position}
                      onChange={(e) =>
                        setNewMember({ ...newMember, position: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>Add Member</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member: any) => (
                  <MemberCard
                    key={member.user.id}
                    member={member}
                    onViewDetails={() => setSelectedMember(member)}
                    onRemove={() => handleRemoveMember(member.user.id)}
                    getInitials={getInitials}
                    getRoleBadgeVariant={getRoleBadgeVariant}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Sheet
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
        >
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>
                {selectedMember?.user.first_name}{" "}
                {selectedMember?.user.last_name}
              </SheetTitle>
              <SheetDescription>{selectedMember?.position}</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarFallback>
                          {selectedMember &&
                            getInitials(
                              selectedMember.user.first_name,
                              selectedMember.user.last_name
                            )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {selectedMember?.user.first_name}{" "}
                          {selectedMember?.user.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedMember?.position}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground mr-2">
                          Email:
                        </span>
                        <span className="text-sm">
                          {selectedMember?.user.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground mr-2">
                          Role:
                        </span>
                        <Badge
                          variant={
                            selectedMember &&
                            getRoleBadgeVariant(selectedMember.role)
                          }
                        >
                          {selectedMember?.role}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground mr-2">
                          Position:
                        </span>
                        <span className="text-sm">
                          {selectedMember?.position}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (selectedMember) {
                        handleRemoveMember(selectedMember.user.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove from Team
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Content>
  );
}

interface MemberCardProps {
  member: any;
  onViewDetails: () => void;
  onRemove: () => void;
  getInitials: (firstName: string, lastName: string) => string;
  getRoleBadgeVariant: (role: string) => string;
}

function MemberCard({
  member,
  onViewDetails,
  onRemove,
  getInitials,
  getRoleBadgeVariant,
}: MemberCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {getInitials(member.user.first_name, member.user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">
              {member.user.first_name} {member.user.last_name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {member.position}
            </p>
          </div>
          <Badge variant={getRoleBadgeVariant(member.role)} className="ml-auto">
            {member.role}
          </Badge>
        </div>
        <div className="border-t flex divide-x">
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10"
            onClick={onViewDetails}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

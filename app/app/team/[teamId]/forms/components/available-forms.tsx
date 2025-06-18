"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, FileText } from "lucide-react";
import { DataTable, type ResponsiveColumnDef, SortableHeader } from "@/components/data-table/data-table";
import { useClientData } from "@/utils/data/client";
import { useHeader } from "@/hooks/useHeader";
import { SendFormDialog } from "./send-form-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import Link from "next/link";

type Form = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export function AvailableForms() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const {
    team: { id: teamId },
  } = useRole();
  const { data: forms = [], isPending, isError } = useClientData().forms.useAll();
  const { user } = useCurrentUser();
  const { data: team, isPending: isTeamPending } = useClientData().teams.useWithUsers(teamId);

  const teamUsersWithoutMe = team?.users.filter((u) => u.user.id !== user?.id).filter((user) => user.role !== "COACH");

  const { useHeaderConfig } = useHeader();
  useHeaderConfig({
    centerContent: "Send Forms",
  });

  const handleSendClick = (formId: string) => {
    setSelectedForm(formId);
    setConfirmDialogOpen(true);
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
    setSelectedForm(null);
  };

  // Column definitions
  const columns: ResponsiveColumnDef<Form>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <SortableHeader column={column}>Form</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-48",
      },
      cell: ({ row }) => {
        const form = row.original;
        return (
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{form.title}</div>
              {form.description && (
                <div className="hidden lg:block text-sm text-muted-foreground truncate max-w-md">
                  {form.description}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      skeleton: {
        type: "button",
        className: "ml-auto",
      },
      cell: ({ row }) => {
        const form = row.original;
        return (
          <div className="flex justify-end">
            <Link href={`/app/team/${teamId}/forms/send/${form.id}`}>
              <Button size={"sm"}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Forms</CardTitle>
          <CardDescription>Send forms to your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Failed to load forms. Please try again later.</div>
        </CardContent>
      </Card>
    );
  }

  if (!isPending && forms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No forms available. Create your first form to get started.
      </div>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={forms} isLoading={isPending} skeletonRows={3} />
      <SendFormDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        formId={selectedForm}
        teamId={teamId}
        teamUsers={teamUsersWithoutMe || []}
        isLoading={isTeamPending}
      />
    </>
  );
}

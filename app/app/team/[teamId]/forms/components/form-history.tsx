"use client";
import { FileText, Clock, Users } from "lucide-react";
import { DataTable, type ResponsiveColumnDef, SortableHeader } from "@/components/data-table/data-table";
import { useClientData } from "@/utils/data/client";
import { useUrl } from "@/hooks/use-url";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { responsiveBreakpoints } from "@/components/data-table/lib/table-utils";
import { useHeader } from "@/hooks/useHeader";
import { useRouter } from "next/navigation";

type FormInvitation = {
  id: string;
  created_at: string;
  form: {
    id: string;
    title: string;
    description?: string;
  };
  invitations?: Array<{
    id: string;
    response?: any;
    user_id: string;
  }>;
};

interface FormHistoryProps {
  teamId: string;
}

export function FormHistory({ teamId }: FormHistoryProps) {
  const { useHeaderConfig } = useHeader();
  useHeaderConfig({
    centerContent: "Form History",
  });
  const router = useRouter();
  const path = useUrl();

  const { data: sentFormInvitations = [], isPending: sentFormsPending } =
    useClientData().formInvitations.useByTeam(teamId);
  const columns: ResponsiveColumnDef<FormInvitation>[] = [
    {
      accessorKey: "form.title",
      mobilePriority: 1,
      header: ({ column }) => <SortableHeader column={column}>Form</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-48",
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="font-medium truncate">{invitation.form.title}</div>
              {invitation.form.description && (
                <div className="text-sm text-muted-foreground truncate max-w-xs">{invitation.form.description}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => <SortableHeader column={column}>Date Sent</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-24",
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{date.toLocaleDateString()}</span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.created_at);
        const dateB = new Date(rowB.original.created_at);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      id: "completion",
      mobilePriority: 2,
      header: ({ column }) => <SortableHeader column={column}>Completion</SortableHeader>,
      skeleton: {
        type: "badge",
      },
      cell: ({ row }) => {
        const invitation = row.original;
        const responded = invitation.invitations?.filter((inv) => inv.response).length || 0;
        const total = invitation.invitations?.length || 0;
        const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={responseRate === 100 ? "default" : responseRate > 50 ? "secondary" : "outline"}>
                {responseRate}% complete
              </Badge>
            </div>
            <div className="hidden sm:block">
              <Progress value={responseRate} className="h-2" />
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const getResponseRate = (invitation: FormInvitation) => {
          const responded = invitation.invitations?.filter((inv) => inv.response).length || 0;
          const total = invitation.invitations?.length || 0;
          return total > 0 ? (responded / total) * 100 : 0;
        };
        return getResponseRate(rowA.original) - getResponseRate(rowB.original);
      },
    },
    {
      id: "responses",
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => <SortableHeader column={column}>Responses</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-20",
      },
      cell: ({ row }) => {
        const invitation = row.original;
        const responded = invitation.invitations?.filter((inv) => inv.response).length || 0;
        const total = invitation.invitations?.length || 0;

        return (
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {responded} of {total}
            </span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const getTotal = (invitation: FormInvitation) => invitation.invitations?.length || 0;
        return getTotal(rowA.original) - getTotal(rowB.original);
      },
    },
  ];

  if (!sentFormsPending && sentFormInvitations.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No forms sent yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">When you send forms to this team, they will appear here.</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={sentFormInvitations}
      isLoading={sentFormsPending}
      skeletonRows={4}
      onRowClick={(row) => {
        const invitation = row.original;
        router.push(`${path}/forms/${invitation.id}`);
      }}
      rowClassName="cursor-pointer hover:bg-muted/50"
    />
  );
}

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, FileText } from "lucide-react";
import {
  DataTable,
  type ResponsiveColumnDef,
  SortableHeader,
} from "@/components/data-table/data-table";
import { useClientData } from "@/utils/data/client";
import { useToast } from "@/hooks/use-toast";
import { useHeader } from "@/hooks/useHeader";

// Type definition for form data
type Form = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

interface AvailableFormsProps {
  teamId: string;
}

export function AvailableForms({ teamId }: AvailableFormsProps) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: forms = [],
    isPending,
    isError,
  } = useClientData().forms.useAll();
  const createFormInvitation = useClientData().formInvitations.useSendToTeam();
  const { toast } = useToast();
  const { useHeaderConfig } = useHeader();
  useHeaderConfig({
    centerContent: "Send Forms",
  });
  const handleSendForm = async () => {
    if (selectedForm && teamId) {
      try {
        setIsSubmitting(true);
        await createFormInvitation.mutateAsync({
          formId: selectedForm,
          teamId: teamId as string,
        });

        toast({
          title: "Success",
          description: "Form sent to team players successfully",
        });

        setSelectedForm(null);
        setConfirmDialogOpen(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to send form invitations",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Column definitions
  const columns: ResponsiveColumnDef<Form>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column}>Form</SortableHeader>
      ),
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
                <div className="text-sm text-muted-foreground truncate max-w-md">
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
            <Button
              onClick={() => {
                setSelectedForm(form.id);
                setConfirmDialogOpen(true);
              }}
              size="sm"
              disabled={isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
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
          <div className="text-center py-8 text-muted-foreground">
            Failed to load forms. Please try again later.
          </div>
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
      <DataTable
        columns={columns}
        data={forms}
        isLoading={isPending}
        skeletonRows={3}
      />

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this form to all team members?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSendForm} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

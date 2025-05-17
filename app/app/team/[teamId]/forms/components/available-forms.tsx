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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, FileText } from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { useToast } from "@/hooks/use-toast";

interface AvailableFormsProps {
  teamId: string;
}

export function AvailableForms({ teamId }: AvailableFormsProps) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: forms, isPending, isError } = useClientData().forms.useAll();
  const createFormInvitation = useClientData().formInvitations.useSendToTeam();
  const { toast } = useToast();

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

  if (isPending || isError) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Available Forms</CardTitle>
          <CardDescription>Send forms to your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {form.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => {
                        setSelectedForm(form.id);
                        setConfirmDialogOpen(true);
                      }}
                      size="sm"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
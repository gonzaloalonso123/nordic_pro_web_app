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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, FileText, Clock } from "lucide-react";
import { useClientData } from "@/utils/data/client";
import { Content } from "@/components/content";

export default function FormsTab() {
  //   const { forms, sentForms, sendForm } = useTeam();
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { data: forms, isPending, isError } = useClientData().forms.useAll();

  const handleSendForm = () => {
    if (selectedForm) {
      //   sendForm(selectedForm);
      setSelectedForm(null);
      setConfirmDialogOpen(false);
    }
  };

  if (isPending || isError) return null;

  return (
    <Content>
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Forms</TabsTrigger>
          <TabsTrigger value="history">Form History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="pt-4">
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
                    <TableHead>Description</TableHead>
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
                      <TableCell>{form.description}</TableCell>
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
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form History</CardTitle>
              <CardDescription>
                Previously sent forms and their responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {sentForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          {form.formTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {form.sentDate}
                        </div>
                      </TableCell>
                      <TableCell>{form.responses} / 20</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
            >
              Cancel
            </Button>
            <Button onClick={handleSendForm}>Send Form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Content>
  );
}

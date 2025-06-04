"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom/tabs";
import { Content } from "@/components/content";
import { useParams } from "next/navigation";
import { AvailableForms } from "./components/available-forms";
import { FormHistory } from "./components/form-history";
import { Card } from "@/components/ui/card";

export default function FormsTab() {
  const { teamId } = useParams();

  return (
    <Content>
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto mb-6">
          <TabsTrigger value="available">Available Forms</TabsTrigger>
          <TabsTrigger value="history">Form History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="pt-4">
          <Card>
            <AvailableForms teamId={teamId as string} />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <FormHistory teamId={teamId as string} />
          </Card>
        </TabsContent>
      </Tabs>
    </Content>
  );
}

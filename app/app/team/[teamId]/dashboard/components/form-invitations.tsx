import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useClientData } from "@/utils/data/client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUrl } from "@/hooks/use-url";
import { useRouter } from "next/navigation";

interface FormInvitationsProps {
  form: {
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    category: string;
    experience: number;
    completionRate: number;
  };
}

export const FormInvitations = () => {
  const { user } = useCurrentUser();
  const { data: formInvitations } = useClientData().formInvitations.useByUser(
    user?.id
  );

  return (
    <div className="flex flex-col gap-4">
      {formInvitations
        ?.filter((inv) => !inv.completed)
        .map((form, index) => (
          <FormInvitation key={form.id} form={form} index={index} />
        ))}
    </div>
  );
};

const FormInvitation = ({
  form,
  index,
}: {
  form: FormInvitationsProps["form"];
  index: number;
}) => {
  const path = useUrl();
  const router = useRouter();

  return (
    <motion.div
      key={form.id}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border-2 border-amber-300 shadow-lg rounded-md">
        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-md w-fit ml-4 -mt-2 border border-amber-300">
          CHECK IN
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-lg">{form.form.title}</CardTitle>
              <CardDescription>{form.form.description}</CardDescription>
            </div>
            <Badge className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
              +{form.form.experience || 500} XP
            </Badge>
          </div>
        </CardHeader>
        {/* <CardContent>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-green-50"
            >
              {form.form.category}
            </Badge>
          </div>
        </CardContent> */}
        <CardFooter className="flex justify-between bg-gray-50 border-t rounded-b-md py-2">
          <Button
            size="xl"
            className={
              index === 0
                ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : ""
            }
            onClick={() => router.push(`${path}/dashboard/form/${form.id}`)}
          >
            Start Form
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

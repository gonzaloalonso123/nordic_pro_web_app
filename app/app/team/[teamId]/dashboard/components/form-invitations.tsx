"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUrl } from "@/hooks/use-url";
import { useRouter } from "next/navigation";
import type { Tables } from "@/types/database.types";

export const FormInvitations = ({
  formInvitations,
}: {
  formInvitations: (Tables<"form_invitations"> & {
    form: Tables<"forms">;
  })[];
}) => {
  const incompleteInvitations = formInvitations?.filter((inv) => !inv.completed) || [];

  if (incompleteInvitations.length === 0) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <Card className="h-full border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-lg">
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-gray-700 font-bold text-lg">All caught up!</p>
              <p className="text-gray-600 font-medium">No pending forms to complete</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {incompleteInvitations.map((invitation, index) => (
        <FormInvitation key={invitation.id} invitation={invitation} index={index} />
      ))}
    </div>
  );
};

const FormInvitation = ({
  invitation,
  index,
}: {
  invitation: Tables<"form_invitations"> & { form: Tables<"forms"> };
  index: number;
}) => {
  const path = useUrl();
  const router = useRouter();
  const isFirst = index === 0;

  return (
    <motion.div
      key={invitation.id}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="relative"
    >
      <Card
        className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
          isFirst
            ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50"
            : "border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }`}
      >
        <CardHeader className="pb-4 pt-6 relative overflow-hidden">
          <motion.div
            className={`absolute -top-8 -right-8 w-24 h-24 ${
              isFirst ? "bg-amber-400" : "bg-gray-300"
            } rounded-full opacity-10`}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 90] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
          />
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {isFirst && (
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  >
                    <Zap className="h-5 w-5 text-amber-500" />
                  </motion.div>
                )}
                {invitation.form.title}
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium mt-1">
                {invitation.form.description}
              </CardDescription>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            >
              <Badge
                className={`font-bold px-3 py-1 ${
                  isFirst
                    ? "bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 border-orange-200"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-200"
                }`}
              >
                +{invitation.form.experience || 500} XP ⚡
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardFooter
          className={`border-t-2 py-4 ${
            isFirst
              ? "bg-gradient-to-r from-amber-100/50 to-orange-100/50 border-amber-200"
              : "bg-gradient-to-r from-gray-100/50 to-gray-200/50 border-gray-200"
          }`}
        >
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className={`w-full font-bold shadow-lg ${
                isFirst
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
              }`}
              onClick={() => router.push(`${path}/dashboard/form/${invitation.id}`)}
            >
              Complete Form
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

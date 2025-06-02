"use client";

import { Card } from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import { Settings } from "lucide-react";
import { LoadingLink } from "@/components/ui/loading-link";
import flags from "@/flags.json";

export const OrganisationCard = ({
  organisation,
}: {
  organisation: Tables<"organisations">;
}) => {
  return (
    <Card className="p-2 px-4 text-xl font-semibold flex items-center justify-between">
      {organisation.name}
      <LoadingLink
        variant="ghost"
        className="flex items-center gap-2"
        href={`${flags.current_app}/organisation/${organisation.id}`}
      >
        <Settings />
        Manage
      </LoadingLink>
    </Card>
  );
};

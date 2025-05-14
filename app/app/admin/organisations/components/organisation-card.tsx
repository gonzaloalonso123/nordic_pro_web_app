"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import { Settings } from "lucide-react";
import Link from "next/link";
import flags from "@/flags.json";

export const OrganisationCard = ({
  organisation,
}: {
  organisation: Tables<"organisations">;
}) => {
  return (
    <Card className="p-2 px-4 text-xl font-semibold flex items-center justify-between">
      {organisation.name}
      <Button variant="ghost" asChild>
        <Link
          className="flex items-center gap-2"
          href={`${flags.current_app}/organisation/${organisation.id}`}
        >
          <Settings />
          Manage
        </Link>
      </Button>
    </Card>
  );
};

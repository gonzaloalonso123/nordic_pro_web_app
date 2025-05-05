"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serverData } from "@/utils/data/server";
import { Tables } from "@/utils/database.types";
import { Settings } from "lucide-react";
import React from "react";
import flags from "@/flags.json";
import Link from "next/link";

const Page = async () => {
  const organisation = await serverData.organisations.getAll();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Organisations</h1>
        <Button asChild>
          <Link href="/admin/organisations/create">Create Organisation</Link>
        </Button>
      </div>
      {organisation.map((org) => (
        <OrganisationCard key={org.id} organisation={org} />
      ))}
    </div>
  );
};

const OrganisationCard = ({
  organisation,
}: {
  organisation: Tables<"organisations">;
}) => {
  return (
    <Card className="p-2 text-xl font-semibold flex items-center justify-between">
      {organisation.name}
      <Button variant="ghost" asChild>
        <Link
          className="flex items-center gap-2"
          href={`${flags.current_app}/admin/organisations/${organisation.id}`}
        >
          <Settings />
          Manage
        </Link>
      </Button>
    </Card>
  );
};

export default Page;

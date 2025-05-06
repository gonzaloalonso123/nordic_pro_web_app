"use client";

import { Button } from "@/components/ui/button";
import { serverData } from "@/utils/data/server";
import Link from "next/link";
import React from "react";
import { OrganisationCard } from "./components/organisation-card";
import { CreateOrganisationButton } from "./components/create-organisation-button";

const Page = async () => {
  const organisation = await serverData.organisations.getAll();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Organisations</h1>
        <CreateOrganisationButton />
      </div>
      {organisation.map((org) => (
        <OrganisationCard key={org.id} organisation={org} />
      ))}
    </div>
  );
};

export default Page;

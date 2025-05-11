"use client";

import React from "react";
import { OrganisationCard } from "./components/organisation-card";
import { CreateOrganisationButton } from "./components/create-organisation-button";
import { useClientData } from "@/utils/data/client";

const Organisations = () => {
  const {
    data: organisations,
    isPending,
    isError,
  } = useClientData().organisations.useAll();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div className="flex flex-col gap-4 container py-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Organisations</h1>
        <CreateOrganisationButton />
      </div>
      {organisations.map((org) => (
        <OrganisationCard key={org.id} organisation={org} />
      ))}
    </div>
  );
};

export default Organisations;

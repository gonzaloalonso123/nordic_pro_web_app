"use client";
import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/components/ui/loading-link";
import { useUrl } from "@/hooks/use-url";
import React from "react";

export const CreateOrganisationButton = () => {
  const path = useUrl();
  return (
    <Button asChild>
      <LoadingLink href={`${path}/organisations/create`}>Create Organisation</LoadingLink>
    </Button>
  );
};

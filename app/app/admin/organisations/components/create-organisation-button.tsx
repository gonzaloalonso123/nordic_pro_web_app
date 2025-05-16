"use client";
import { Button } from "@/components/ui/button";
import { useUrl } from "@/hooks/use-url";
import Link from "next/link";
import React from "react";

export const CreateOrganisationButton = () => {
  const path = useUrl();
  return (
    <Button asChild>
      <Link href={`${path}/organisations/create`}>Create Organisation</Link>
    </Button>
  );
};

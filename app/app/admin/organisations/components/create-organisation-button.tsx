"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const CreateOrganisationButton = () => {
  return (
    <Button asChild>
      <Link href="/app/admin/organisations/create">
        Create Organisation
      </Link>
    </Button>
  );
};

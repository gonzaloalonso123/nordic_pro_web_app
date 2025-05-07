import { Disclaimer } from "@/components/disclaimer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { serverData } from "@/utils/data/server";
import { Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import flags from "@/flags.json";
import NavTabs from "./nav-tabs";

interface LayoutProps {
  params: {
    organisationId: string;
  };
  children: React.ReactNode;
}

const Layout = async ({ params, children }: LayoutProps) => {
  const organisationId = params.organisationId;
  const organisation = await serverData.organisations.getById(organisationId);
  const basePath = `/unsupervised-app/admin/organisations/${organisationId}`;

  if (!organisation) {
    return (
      <Disclaimer
        variant="error"
        title="Organisation not found"
        description="The organisation you are trying to access does not exist."
      />
    );
  }

  return (
    <div>
      <div className="flex bg-background p-4 pb-0 flex-col gap-3">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                className="p-2"
                src="/organisation_placeholder.png"
                alt={organisation.name}
              />
            </Avatar>
            {organisation.name}
          </h1>
          <Link
            href={`${flags.current_app}/admin/organisations/${organisationId}/settings`}
          >
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
        <NavTabs basePath={basePath} />
      </div>
      {children}
    </div>
  );
};

export default Layout;

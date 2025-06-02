import { Disclaimer } from "@/components/disclaimer";
import { serverData } from "@/utils/data/server";
import { Settings } from "lucide-react";
import React from "react";
import NavTabs from "./nav-tabs";
import { LoadingLink } from "@/components/ui/loading-link";

interface LayoutProps {
  params: Promise<{
    organisationId: string;
    teamId?: string;
  }>;
  children: React.ReactNode;
}

const Layout = async (props: LayoutProps) => {
  const params = await props.params;

  const { children } = props;

  const organisationId = params.organisationId;
  const organisation = await serverData.organisations.getById(organisationId);
  const basePath = `/app/organisation/${organisationId}`;

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
      <div className="flex bg-white p-4 pb-0 flex-col gap-3">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold flex gap-2 items-center">
            <img
              className="h-4/6 w-8 object-cover p-1"
              src="/organisation_placeholder.png"
              alt={organisation.name}
            />
            {organisation.name}
          </h1>
          <LoadingLink variant="outline" href={`${basePath}/settings`} className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            <span className="hidden md:block">Settings</span>
          </LoadingLink>
        </div>
        <NavTabs basePath={basePath} />
      </div>
      {children}
    </div>
  );
};

export default Layout;

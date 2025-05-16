import type React from "react";
import PlatformHeader from "@/components/platform/platform-header";
import PlatformSidebar from "@/components/platform/platform-sidebar";
import { RoleProvider } from "./(role-provider)/role-provider";
import { getUserRoles } from "@/utils/get-user-roles";

async function PlatformLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const roles = await getUserRoles();
  return (
    <RoleProvider {...roles}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PlatformHeader />
        <div className="flex flex-1">
          <PlatformSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </RoleProvider>
  );
}

export default PlatformLayoutClient;

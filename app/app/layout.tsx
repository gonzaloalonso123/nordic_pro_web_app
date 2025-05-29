import type React from "react";
import Header from '@/components/platform/Header';
import { HeaderContextProvider } from '@/contexts/HeaderContext';
import PlatformSidebar from "@/components/platform/platform-sidebar";
import { RoleProvider } from "./(role-provider)/role-provider";
import { getUserRoles } from "@/utils/get-user-roles";
import InstallPrompt from "@/components/platform/install-prompt";

async function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const roles = await getUserRoles();

  return (
    <HeaderContextProvider>
      <RoleProvider {...roles}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <div className="flex flex-1">
            <PlatformSidebar />
            <InstallPrompt />
            <main className="flex-1 pt-0">
              {children}
            </main>
          </div>
        </div>
      </RoleProvider>
    </HeaderContextProvider>
  );
}

export default AppLayoutClient;

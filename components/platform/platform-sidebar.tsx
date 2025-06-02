"use client";

import { useState } from "react";
import { LoadingLink } from "@/components/ui/loading-link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MobilePlatformNavbar from "@/components/mobile-platform-navbar";
import { useMenuItems } from "@/hooks/use-menu-items";

export default function PlatformSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = useMenuItems();

  return (
    <>
      <div
        className={cn(
          "bg-white border-r border-gray-200 h-screen-without-header sticky top-16 transition-all duration-300 hidden md:flex flex-col justify-between",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div>
          <div className={cn("p-4 flex transition-all", !collapsed && "justify-end")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </Button>
          </div>

          <nav className="px-3 py-2">
            <ul className={cn("space-y-1 flex flex-col transition-all")}>
              {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <LoadingLink
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        collapsed && "w-fit"
                      )}
                      unstyled
                      showSpinner
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </LoadingLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <MobilePlatformNavbar />
    </>
  );
}

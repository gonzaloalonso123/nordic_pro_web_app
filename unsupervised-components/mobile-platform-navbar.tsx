"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, MessageSquare, Users } from "lucide-react";
import flags from "@/flags.json";

export default function MobilePlatformNavbar() {
  const pathname = usePathname();
  const root = flags.current_app;

  const navItems = [
    { name: "Dashboard", href: root, icon: Home },
    { name: "Team", href: `${root}/team`, icon: Users },
    // { name: "Mental Health", href: "/platform/mental-health", icon: Heart },
    // { name: "Motivation", href: "/platform/motivation", icon: Trophy },
    { name: "Calendar", href: `${root}/calendar`, icon: Calendar },
    { name: "Messages", href: `${root}/chat`, icon: MessageSquare },
    // { name: "Analytics", href: "/platform/analytics", icon: BarChart3 },
    // { name: "Settings", href: "/platform/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg md:hidden z-50">
      <nav className="flex justify-around w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full flex-col items-center py-2 px-3 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

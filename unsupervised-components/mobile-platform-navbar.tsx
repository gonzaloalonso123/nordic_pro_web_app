"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenuItems } from "@/hooks/use-menu-items";

export default function MobilePlatformNavbar() {
  const pathname = usePathname();
  const items = useMenuItems();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-4 md:hidden z-50">
      <nav className="flex justify-around w-full">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full flex-col items-center py-2 px-3 ${isActive ? "text-primary" : "text-gray-500"}`}
            >
              <div className={`p-1 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
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

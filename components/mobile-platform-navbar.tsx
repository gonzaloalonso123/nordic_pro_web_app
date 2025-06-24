"use client";

import { LoadingLink } from "@/components/ui/loading-link";
import { usePathname } from "next/navigation";
import { useMenuItems } from "@/hooks/use-menu-items";
import { cn } from "@/lib/utils";
import { useKeyboardOpen } from "@/hooks/use-keyboard-open";

export default function MobilePlatformNavbar() {
  const keyboardOpen = useKeyboardOpen(100);
  if (keyboardOpen) return null;

  const pathname = usePathname();
  const items = useMenuItems();
  return (
    <div className="fixed pb-3 bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
      <nav className="flex justify-around align-start w-full">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <LoadingLink
              key={item.name}
              href={item.href}
              unstyled
              className={cn('flex w-full flex-col items-center py-4', isActive ? "text-primary" : "text-gray-500")}
            >
              <div className={cn('rounded-full p-1', isActive && "bg-primary/10")}>
                <Icon className="h-6 w-6" />
              </div>
            </LoadingLink>
          );
        })}
      </nav>
    </div>
  );
}

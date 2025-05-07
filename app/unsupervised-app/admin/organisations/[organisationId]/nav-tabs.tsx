"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavTabsProps {
  basePath: string;
}

export default function NavTabs({ basePath }: NavTabsProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === basePath) {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="flex space-x-4 border-b">
      <Link
        href={basePath}
        className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 ${
          isActive(basePath)
            ? "border-primary text-primary font-semibold"
            : "border-transparent hover:bg-muted"
        }`}
      >
        Dashboard
      </Link>
      <div
        //change to Link to activate
        href={`${basePath}/analytics`}
        className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 ${
          isActive(`${basePath}/analytics`)
            ? "border-primary text-primary font-semibold"
            : "border-transparent hover:bg-muted"
        }`}
      >
        Analytics
      </div>
    </nav>
  );
}

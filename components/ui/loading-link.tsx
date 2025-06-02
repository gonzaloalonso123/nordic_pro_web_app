"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

interface LoadingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {
  href: string;
  children: ReactNode;
  className?: string;
  showSpinner?: boolean;
  unstyled?: boolean;
  loadingContent?: ReactNode;
}

export function LoadingLink({
  href,
  children,
  className,
  showSpinner = true,
  variant = "link",
  unstyled = false,
  size,
  rounded,
  loadingContent,
  ...props
}: LoadingLinkProps) {
  const { isNavigating, setIsNavigating, loadingPath, setLoadingPath } = useLoading();
  const pathname = usePathname();

  const handleClick = () => {
    if (href === pathname) return;
    if (href.startsWith('http')) return;
    if (href.startsWith('#')) return;

    setIsNavigating(true);
    setLoadingPath(href);
  };

  const isCurrentlyLoading = isNavigating && loadingPath === href;

  const defaultLoadingContent = <Loader2 className={"animate-spin h-6 w-6"} />;

  const renderLoadingContent = () => {
    if (!showSpinner) return children;

    return loadingContent ?? defaultLoadingContent;
  };

  return (
    <Link
      href={href}
      className={cn(
        !unstyled && buttonVariants({ variant, size, rounded }),
        isCurrentlyLoading && "opacity-75 pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {isCurrentlyLoading ? renderLoadingContent() : children}
    </Link>
  );
}

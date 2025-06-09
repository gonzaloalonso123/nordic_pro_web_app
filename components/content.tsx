import { cn } from "@/lib/utils";

export function Content({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("container py-4 pb-22 md:pb-4", className)}>{children}</div>;
}

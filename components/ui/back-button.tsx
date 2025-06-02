import { ArrowLeft } from "lucide-react";
import { LoadingLink } from "./loading-link";
import { cn } from "@/lib/utils";

export default function BackButton({ path, classNames }: { path: string, classNames?: string }) {
  return (
    <LoadingLink
      aria-label="Back"
      variant="ghost"
      size="icon"
      href={path}
      className={cn('mr-2', classNames)}
    >
      <ArrowLeft className="h-5 w-5" />
    </LoadingLink>
  );
}

import { ChevronLeft } from "lucide-react";
import { LoadingLink } from "./loading-link";
import { Button } from "./button";
import { useRouter } from "next/router";

export default function BackButton({ path, classNames }: { path?: string, classNames?: string }) {
  const router = useRouter();

  const backButton = <ChevronLeft className="h-6 w-6" />;

  if (!path) {
    return (
      <Button variant="ghost" aria-label="Back" className={classNames} onClick={() => router.back()} >
        {backButton}
      </Button>
    );
  }

  return (
    <LoadingLink
      aria-label="Back"
      variant="ghost"
      size="icon"
      href={path}
      className={classNames}
    >
      {backButton}
    </LoadingLink>
  );
}

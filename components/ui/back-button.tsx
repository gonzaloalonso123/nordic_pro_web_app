import { ChevronLeft } from "lucide-react";
import { LoadingLink } from "./loading-link";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export default function BackButton({
  path,
  className,
  onClick,
}: {
  path?: string;
  className?: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  const backButton = <ChevronLeft className="h-6 w-6" />;

  if (!path) {
    return (
      <Button
        variant="ghost"
        aria-label="Back"
        className={className}
        onClick={onClick ? () => onClick() : () => router.back()}
      >
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
      className={className}
    >
      {backButton}
    </LoadingLink>
  );
}

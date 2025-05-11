import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const SubmitButton = ({
  children,
  className,
  disabled,
  loading,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <Button
      className={cn("disabled:brightness-60", className)}
      disabled={disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
      {children}
    </Button>
  );
};

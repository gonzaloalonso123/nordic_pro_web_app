import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

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
    <Button className="w-fit self-end">
      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
      {children}
    </Button>
  );
};

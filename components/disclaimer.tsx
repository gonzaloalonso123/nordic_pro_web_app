import { cn } from "@/lib/utils";

type DisclaimerVariant = "primary" | "error" | "success" | "custom";

interface DisclaimerProps {
  title: string;
  description: string;
  variant?: DisclaimerVariant;
  customColor?: string;
  className?: string;
}

export function Disclaimer({
  title,
  description,
  variant = "primary",
  customColor,
  className,
}: DisclaimerProps) {
  const getVariantStyles = (): { bg: string; text: string } => {
    switch (variant) {
      case "primary":
        return { bg: "bg-primary/5", text: "text-primary" };
      case "error":
        return { bg: "bg-accent/5", text: "text-accent" };
      case "success":
        return { bg: "bg-green-50", text: "text-green" };
      case "custom":
        return {
          bg: customColor ? `bg-${customColor}/5` : "bg-gray/5",
          text: customColor ? `text-${customColor}` : "text-gray",
        };
    }
  };

  const { bg, text } = getVariantStyles();

  return (
    <div className={cn(bg, "p-4 rounded-lg", className)}>
      <h4 className={cn("font-bold", text)}>{title}</h4>
      <p className="text-sm text-foreground/70">{description}</p>
    </div>
  );
}

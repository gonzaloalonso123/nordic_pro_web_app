import { Switch } from "@/components/ui/switch";
import type { LucideIcon } from "lucide-react";

interface VisibilityToggleProps {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function VisibilityToggle({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
}: VisibilityToggleProps) {
  return (
    <div className={`flex items-center justify-between`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full`}>
          <Icon className={`h-6 w-6 text-blue-500`} />
        </div>
        <div>
          <p className="text-sm">{label}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

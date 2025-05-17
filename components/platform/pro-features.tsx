import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProFeatures({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="p-3 self-end">
      <div
        className={cn(
          "bg-primary/5 rounded-lg p-4 border border-primary/10",
          collapsed ? "text-center" : ""
        )}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
          <Trophy className="h-4 w-4" />
        </div>
        {!collapsed && (
          <>
            <h4 className="font-medium text-sm text-center mb-1">
              Pro Features
            </h4>
            <p className="text-xs text-gray-500 mb-2">
              Unlock advanced analytics and team insights.
            </p>
            <Button size="sm" className="w-full text-xs">
              Upgrade
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

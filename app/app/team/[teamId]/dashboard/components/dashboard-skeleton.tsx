import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = ({ height }: { height: string }) => {
  return (
    <div className="space-y-3 p-4 shadow-sm rounded-lg" style={{ height: height || "200px" }}>
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

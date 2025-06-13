import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, Calendar, MapPin, Sparkles } from "lucide-react";

export const DashboardSkeleton = () => {
  return (
    <Card className="h-full border-2 border-gray-200 bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex flex-row items-start justify-between mb-3">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
              <Skeleton className="w-10" />
            </div>
            <Badge className="bg-gray-200 text-gray-700 font-bold px-3 py-1 animate-pulse">{"     "}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium animate-pulse">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Skeleton className="w-32" />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium animate-pulse">
            <MapPin className="h-5 w-5 text-gray-500" />
            <Skeleton className="w-32" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-100 py-3">
        <Button className="w-full bg-gray-500 text-white shadow-lg font-bold disabled animate-pulse">{"     "}</Button>
      </CardFooter>
    </Card>
  );
};

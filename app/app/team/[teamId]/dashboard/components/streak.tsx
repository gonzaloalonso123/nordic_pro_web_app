import { CheckCircle } from "lucide-react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StreakData {
  current: number;
  longest: number;
  lastUpdated: Date;
  history: {
    date: string;
    completed: boolean;
  }[];
}
export const Streak = ({
  streak,
  title,
  description,
}: {
  streak: StreakData;
  title: string;
  description: string;
}) => {
  const renderStreakCalendar = (streak: StreakData) => {
    const last7Days = streak.history.slice(0, 7).reverse();

    return (
      <div className="flex gap-1 mt-2">
        {last7Days.map((day, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                day.completed
                  ? "bg-linear-to-br from-green-500 to-emerald-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {day.completed ? <CheckCircle className="h-3 w-3" /> : ""}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {new Date(day.date)
                .toLocaleDateString(undefined, { weekday: "short" })
                .charAt(0)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-orange-200">
        <CardHeader className="pb-2 bg-linear-to-r from-orange-50 to-amber-50">
          <CardTitle className="text-lg flex items-center">
            <Flame className="mr-2 h-5 w-5 text-orange-500" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {streak.current}
              </div>
              <div>
                <div className="font-medium">Current Streak</div>
                <div className="text-xs text-muted-foreground">
                  {streak.current === 0
                    ? "Start your streak today!"
                    : `${streak.current} day${streak.current !== 1 ? "s" : ""} in a row`}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              Best: {streak.longest}
            </Badge>
          </div>

          <div className="bg-orange-50 p-2 rounded-md">
            <div className="text-xs font-medium text-orange-700 mb-1">
              Last 7 days
            </div>
            {renderStreakCalendar(streak)}
          </div>

          <div className="mt-3 text-xs text-center text-muted-foreground">
            Complete a form today to keep your streak going!
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

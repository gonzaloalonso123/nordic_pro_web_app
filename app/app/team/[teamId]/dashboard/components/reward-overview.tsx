import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Sparkles, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getLevelByExperience } from "@/content/level-calculator";

export const RewardOverview = () => {
  const { user } = useCurrentUser();

  const { level, experienceInLevel, levelTotalExperience } =
    getLevelByExperience(user?.total_experience || 0);
  const progress = (experienceInLevel / levelTotalExperience) * 100;

  return (
    <Card className="bg-linear-to-br from-indigo-50 to-purple-50 border-indigo-200 overflow-hidden mb-6">
      <CardHeader className="pb-2 relative">
        <motion.div
          className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500 rounded-full opacity-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <CardTitle className="text-xl flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
          {user?.first_name} {user?.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-1 mt-2">
          <motion.div
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-linear-to-br from-indigo-600 to-purple-600 text-white h-12 w-12 rounded-full flex items-center justify-center mr-3 font-bold text-lg shadow-md">
              {level}
            </div>
            <div>
              <div className="font-bold text-lg">Level {level}</div>
              <div className="text-sm text-muted-foreground">Adventurer</div>
            </div>
          </motion.div>
          <motion.div
            className="text-sm font-medium"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {experienceInLevel} / {levelTotalExperience} XP
          </motion.div>
        </div>

        <Progress value={progress} className="h-3 bg-indigo-100 mt-4">
          <motion.div
            className="h-full w-full"
            style={{
              backgroundImage: "linear-gradient(to right, #818cf8, #a78bfa)",
              backgroundRepeat: "no-repeat",
            }}
            initial={{ backgroundSize: "0% 100%" }}
            animate={{ backgroundSize: `${progress}% 100%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </Progress>

        <div className="mt-6 space-y-4">
          {/* <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>Forms Completed</span>
            </div>
            <Badge variant="outline" className="bg-green-50">
              12
            </Badge>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span>Current Streak</span>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              3 days
            </Badge>
          </div> */}

          {/* <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-amber-500" />
              <span>Trophies Earned</span>
            </div>
            <Badge variant="outline" className="bg-amber-50">
              {trophies.filter((t) => t.earned).length}/{trophies.length}
            </Badge>
          </div> */}
        </div>
      </CardContent>
      <CardFooter className="bg-linear-to-r from-indigo-100/50 py-2 to-purple-100/50 border-t border-indigo-200">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-indigo-700">Next level in: </span>
          {levelTotalExperience - experienceInLevel} XP
        </div>
      </CardFooter>
    </Card>
  );
};

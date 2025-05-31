import { Award, CheckCircle, Clock, Trophy, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Progress } from "../ui/progress";

interface TrophyType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedAt?: Date;
}

const trophies = [
  {
    id: "first-form",
    name: "First Steps",
    description: "Complete your first form",
    icon: <CheckCircle className="h-6 w-6" />,
    color: "bg-green-500",
    earned: true,
    earnedAt: new Date(2023, 3, 15),
  },
  {
    id: "five-forms",
    name: "Form Explorer",
    description: "Complete 5 different forms",
    icon: <Star className="h-6 w-6" />,
    color: "bg-blue-500",
    earned: true,
    earnedAt: new Date(2023, 4, 2),
  },
  {
    id: "streak",
    name: "Consistency Champion",
    description: "Complete forms 3 days in a row",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-yellow-500",
    earned: true,
    earnedAt: new Date(),
  },
  {
    id: "all-categories",
    name: "Well-Rounded",
    description: "Complete forms from all categories",
    icon: <Trophy className="h-6 w-6" />,
    color: "bg-purple-500",
    earned: false,
    progress: 3,
    maxProgress: 5,
  },
  {
    id: "perfect-score",
    name: "Perfectionist",
    description: "Earn maximum XP on a form",
    icon: <Award className="h-6 w-6" />,
    color: "bg-pink-500",
    earned: false,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete a form in under 60 seconds",
    icon: <Clock className="h-6 w-6" />,
    color: "bg-orange-500",
    earned: false,
  },
];

export const Trophies = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-amber-500" />
        Your Trophies
      </CardTitle>
      <CardDescription>
        Achievements you've earned on your journey
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trophies.map((trophy, index) => (
          <motion.div
            key={trophy.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`border ${trophy.earned ? "bg-linear-to-r from-gray-50 to-gray-100" : "bg-gray-100 opacity-70"}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`${trophy.color} ${trophy.earned ? "" : "bg-opacity-50"} h-12 w-12 rounded-full flex items-center justify-center text-white`}
                >
                  {trophy.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium flex items-center">
                    {trophy.name}
                    {trophy.earned && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: 0 }}
                      >
                        <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
                      </motion.div>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {trophy.description}
                  </p>
                  {trophy.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {trophy.progress}/{trophy.maxProgress}
                        </span>
                      </div>
                      <Progress
                        value={
                          (trophy.progress / (trophy.maxProgress || 1)) * 100
                        }
                        className="h-1.5"
                      />
                    </div>
                  )}
                  {trophy.earned && trophy.earnedAt && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Earned on {trophy.earnedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </CardContent>
    <CardFooter className="bg-gray-50">
      <div className="text-sm text-center w-full text-muted-foreground">
        Complete more forms to unlock all trophies!
      </div>
    </CardFooter>
  </Card>
);

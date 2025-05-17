"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Trophy,
  Star,
  Zap,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Flame,
  CalendarCheck,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Content } from "@/components/content";
import { FormInvitations } from "./components/form-invitations";
import { RewardOverview } from "./components/reward-overview";

// Trophy/achievement type
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

// Next form type
interface NextForm {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  experience: number;
  category: string;
  completionRate: number;
}

// Streak type
interface StreakData {
  current: number;
  longest: number;
  lastUpdated: Date;
  history: {
    date: string;
    completed: boolean;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();

  const { toast } = useToast();

  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);
  const [progress, setProgress] = useState(0);
  const [trophies, setTrophies] = useState<TrophyType[]>([]);
  const [nextForms, setNextForms] = useState<NextForm[]>([]);
  const [formStreak, setFormStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    lastUpdated: new Date(),
    history: [],
  });
  const [attendanceStreak, setAttendanceStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    lastUpdated: new Date(),
    history: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Since they're launched randomly, these won't necessarily use all of startVelocity, spread, etc.
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#FFD700", "#FFA500", "#FF4500", "#FF6347"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showConfetti]);

  useEffect(() => {
    const mockExperience = 450;
    const calculatedLevel =
      Math.floor(Math.log(mockExperience / 10 + 1) / Math.log(1.5)) + 1;
    const currentLevelXp = Math.floor(
      10 * (Math.pow(1.5, calculatedLevel - 1) - 1)
    );
    const calculatedNextLevelXp = Math.floor(
      10 * (Math.pow(1.5, calculatedLevel) - 1)
    );
    const xpForCurrentLevel = calculatedNextLevelXp - currentLevelXp;
    const xpProgress = mockExperience - currentLevelXp;
    const calculatedProgress = (xpProgress / xpForCurrentLevel) * 100;

    setLevel(calculatedLevel);
    setExperience(mockExperience);
    setNextLevelXp(calculatedNextLevelXp);
    setProgress(calculatedProgress);

    // Mock trophies data
    setTrophies([
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
    ]);

    // Mock next forms data
    setNextForms([
      {
        id: "form-1",
        title: "Weekly Team Check-in",
        description: "Quick pulse check on how the team is feeling this week",
        estimatedTime: "2 min",
        experience: 50,
        category: "Team Health",
        completionRate: 85,
      },
      {
        id: "form-2",
        title: "Product Feedback",
        description: "Share your thoughts on our latest feature release",
        estimatedTime: "5 min",
        experience: 100,
        category: "Product",
        completionRate: 72,
      },
      {
        id: "form-3",
        title: "Monthly Goals Review",
        description: "Review and reflect on your monthly goals",
        estimatedTime: "10 min",
        experience: 150,
        category: "Personal Development",
        completionRate: 64,
      },
    ]);

    // Mock form streak data
    setFormStreak({
      current: 5,
      longest: 12,
      lastUpdated: new Date(),
      history: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // Create a pattern with some gaps to make it realistic
        const completed =
          i === 0 ||
          i === 1 ||
          i === 2 ||
          i === 3 ||
          i === 4 ||
          i === 7 ||
          i === 8 ||
          i === 10 ||
          i === 11 ||
          i === 15 ||
          i === 16 ||
          i === 17 ||
          i === 20 ||
          i === 25;
        return {
          date: date.toISOString().split("T")[0],
          completed,
        };
      }),
    });

    // Mock attendance streak data
    setAttendanceStreak({
      current: 8,
      longest: 14,
      lastUpdated: new Date(),
      history: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // Create a pattern with some gaps to make it realistic
        const completed =
          i === 0 ||
          i === 1 ||
          i === 2 ||
          i === 3 ||
          i === 4 ||
          i === 5 ||
          i === 6 ||
          i === 7 ||
          i === 9 ||
          i === 10 ||
          i === 12 ||
          i === 13 ||
          i === 15 ||
          i === 16 ||
          i === 17 ||
          i === 20 ||
          i === 21 ||
          i === 25;
        return {
          date: date.toISOString().split("T")[0],
          completed,
        };
      }),
    });
    const newestTrophy = trophies.find(
      (t) =>
        t.earned &&
        t.earnedAt &&
        new Date().getTime() - t.earnedAt.getTime() < 1000 * 60 * 60 * 24
    );
    if (newestTrophy) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setIsLoading(false);
  }, [toast]);

  const renderStreakCalendar = (streak: StreakData) => {
    const last7Days = streak.history.slice(0, 7).reverse();

    return (
      <div className="flex gap-1 mt-2">
        {last7Days.map((day, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                day.completed
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
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

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <Content>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Track your progress, earn trophies, and continue your journey!
      </p>

      <div className="lg:col-span-2 pb-4">
        <Tabs defaultValue="next-form" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="next-form" className="text-sm">
              <Zap className="h-4 w-4 mr-2" />
              Next Forms
            </TabsTrigger>
            <TabsTrigger value="trophies" className="text-sm">
              <Trophy className="h-4 w-4 mr-2" />
              Trophies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="next-form" className="mt-0">
            <FormInvitations />
          </TabsContent>

          <TabsContent value="trophies" className="mt-0">
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
                        className={`border ${trophy.earned ? "bg-gradient-to-r from-gray-50 to-gray-100" : "bg-gray-100 opacity-70"}`}
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
                                    (trophy.progress /
                                      (trophy.maxProgress || 1)) *
                                    100
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
          </TabsContent>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
        <RewardOverview />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-orange-200">
            <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="text-lg flex items-center">
                <Flame className="mr-2 h-5 w-5 text-orange-500" />
                Form Streak
              </CardTitle>
              <CardDescription>
                Complete forms consistently to build your streak
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {formStreak.current}
                  </div>
                  <div>
                    <div className="font-medium">Current Streak</div>
                    <div className="text-xs text-muted-foreground">
                      {formStreak.current === 0
                        ? "Start your streak today!"
                        : `${formStreak.current} day${formStreak.current !== 1 ? "s" : ""} in a row`}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  Best: {formStreak.longest}
                </Badge>
              </div>

              <div className="bg-orange-50 p-2 rounded-md">
                <div className="text-xs font-medium text-orange-700 mb-1">
                  Last 7 days
                </div>
                {renderStreakCalendar(formStreak)}
              </div>

              <div className="mt-3 text-xs text-center text-muted-foreground">
                Complete a form today to keep your streak going!
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-blue-200">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="text-lg flex items-center">
                <CalendarCheck className="mr-2 h-5 w-5 text-blue-500" />
                Attendance Streak
              </CardTitle>
              <CardDescription>
                Log in daily to maintain your attendance record
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {attendanceStreak.current}
                  </div>
                  <div>
                    <div className="font-medium">Current Streak</div>
                    <div className="text-xs text-muted-foreground">
                      {attendanceStreak.current === 0
                        ? "Start your streak today!"
                        : `${attendanceStreak.current} day${attendanceStreak.current !== 1 ? "s" : ""} in a row`}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Best: {attendanceStreak.longest}
                </Badge>
              </div>

              <div className="bg-blue-50 p-2 rounded-md">
                <div className="text-xs font-medium text-blue-700 mb-1">
                  Last 7 days
                </div>
                {renderStreakCalendar(attendanceStreak)}
              </div>

              <div className="mt-3 text-xs text-center text-muted-foreground">
                You've logged in today! Come back tomorrow to continue your
                streak.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            Weekly Challenge
          </CardTitle>
          <CardDescription>
            Complete 3 forms this week to earn a special trophy and bonus XP!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={33.3} className="h-2" />
          <div className="flex justify-between mt-2 text-sm">
            <span>1/3 completed</span>
            <span className="text-blue-600 font-medium">Reward: +100 XP</span>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-100/50 border-t border-blue-200 py-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/forms")}
          >
            View All Forms
          </Button>
        </CardFooter>
      </Card>
    </Content>
  );
}

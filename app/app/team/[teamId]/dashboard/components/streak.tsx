"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export const Streak = ({ streak, title, description }: { streak: StreakData; title: string; description: string }) => {
  const renderCompletionHistory = (streak: StreakData) => {
    const last7Invitations = [...streak.history].reverse();

    return (
      <div className="flex gap-1 sm:gap-2 mt-3">
        {last7Invitations.map((invitation, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center flex-1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <motion.div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                invitation.completed
                  ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                  : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {invitation.completed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </motion.div>
            <div className="text-xs text-gray-600 mt-1 font-medium">
              {new Date(invitation.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 relative overflow-hidden">
          <motion.div
            className="absolute -top-8 -right-8 w-24 h-24 bg-orange-400 rounded-full opacity-10"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Flame className="mr-3 h-6 w-6 text-orange-500" />
            </motion.div>
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <motion.div
                className="bg-gradient-to-br from-orange-500 to-red-600 text-white h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {streak.current}
              </motion.div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-lg text-gray-800">Current Streak</div>
                <div className="text-sm text-gray-600 font-medium">
                  {streak.current === 0
                    ? "Complete your next form! 🚀"
                    : `${streak.current} form${streak.current !== 1 ? "s" : ""} in a row! 🔥`}
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 border-orange-200 font-bold px-3 py-1 self-center sm:self-auto">
              Best: {streak.longest}
            </Badge>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-3 sm:p-4 rounded-xl border border-orange-200">
            <div className="text-sm font-bold text-orange-800 mb-1">Recent Progress</div>
            {renderCompletionHistory(streak)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

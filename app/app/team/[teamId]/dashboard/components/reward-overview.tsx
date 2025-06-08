"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Sparkles, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { getLevelByExperience } from "@/content/level-calculator"

export const RewardOverview = () => {
  const { user } = useCurrentUser()

  const { level, experienceInLevel, levelTotalExperience } = getLevelByExperience(user?.total_experience || 0)
  const progress = (experienceInLevel / levelTotalExperience) * 100

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 relative overflow-hidden">
          <motion.div
            className="absolute -top-8 -right-8 w-24 h-24 bg-purple-400 rounded-full opacity-10"
            animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Sparkles className="mr-3 h-6 w-6 text-purple-500" />
            </motion.div>
            {user?.first_name} {user?.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {level}
              </motion.div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-lg text-gray-800 flex items-center justify-center sm:justify-start gap-2">
                  Level {level}
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="text-sm text-gray-600 font-medium">Adventurer 🗡️</div>
              </div>
            </motion.div>
            <motion.div
              className="text-sm font-bold bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-2 rounded-xl border border-purple-200 text-purple-700 self-center sm:self-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {experienceInLevel} / {levelTotalExperience} XP
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">Progress to Level {level + 1}</span>
              <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <Progress
                value={progress}
                className="h-3 sm:h-4 bg-purple-100 border border-purple-200 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </Progress>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                style={{ width: "30%" }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-purple-100/50 to-indigo-100/50 border-t-2 border-purple-200 py-3">
          <div className="text-sm text-gray-600 font-medium">
            <span className="font-bold text-purple-700">Next level in: </span>
            {levelTotalExperience - experienceInLevel} XP ⚡
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

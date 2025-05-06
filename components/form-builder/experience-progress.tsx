"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp } from "lucide-react"
import type { UserProfile } from "./types"

export default function ExperienceProgress() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [levelInfo, setLevelInfo] = useState({ level: 1, nextLevelXp: 100, progress: 0 })

  useEffect(() => {
    // Load user profile from localStorage
    const storedProfile = localStorage.getItem("user-profile")
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      setUserProfile(profile)

      // Calculate level based on experience (simple logarithmic progression)
      const level = Math.floor(Math.log(profile.totalExperience / 10 + 1) / Math.log(1.5)) + 1
      const currentLevelXp = Math.floor(10 * (Math.pow(1.5, level - 1) - 1))
      const nextLevelXp = Math.floor(10 * (Math.pow(1.5, level) - 1))
      const xpForCurrentLevel = nextLevelXp - currentLevelXp
      const xpProgress = profile.totalExperience - currentLevelXp
      const progress = (xpProgress / xpForCurrentLevel) * 100

      setLevelInfo({
        level,
        nextLevelXp: nextLevelXp,
        progress,
      })
    }
  }, [])

  if (!userProfile) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5 text-amber-500" />
          Your Experience
        </CardTitle>
        <CardDescription>Track your progress and level up</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-amber-100 text-amber-800 h-8 w-8 rounded-full flex items-center justify-center mr-2 font-bold">
              {levelInfo.level}
            </div>
            <span className="font-medium">Level {levelInfo.level}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {userProfile.totalExperience} / {levelInfo.nextLevelXp} XP
          </div>
        </div>
        <Progress value={levelInfo.progress} className="h-2" />

        <div className="mt-4 text-sm text-muted-foreground flex items-center">
          <TrendingUp className="h-4 w-4 mr-1.5 text-green-500" />
          <span>Completed {userProfile.completedForms.length} forms</span>
        </div>
      </CardContent>
    </Card>
  )
}

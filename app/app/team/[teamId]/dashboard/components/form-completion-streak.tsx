"use client";
import { Streak } from "./streak";
import { calculateStreakFromInvitations } from "../utils/streak-calculator";
import { Tables } from "@/types/database.types";

export function FormCompletionStreak({ formInvitations }: { formInvitations: Tables<"form_invitations">[] }) {
  const streakData = calculateStreakFromInvitations(formInvitations);

  return (
    <Streak
      streak={streakData}
      title="Form Completion Streak"
      description="Keep completing all your forms to maintain your streak!"
    />
  );
}

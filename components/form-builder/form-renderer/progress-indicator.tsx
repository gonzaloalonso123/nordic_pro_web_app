import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface ProgressIndicatorProps {
  currentQuestion?: number;
  totalQuestions: number;
  earnedExperience: number;
  progressPercentage: number;
}

export function ProgressIndicator({
  currentQuestion,
  totalQuestions,
  earnedExperience,
  progressPercentage,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between items-center">
        {currentQuestion !== undefined ? (
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {totalQuestions}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Form completion</p>
        )}
        <div className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-700">
            {earnedExperience} XP
          </span>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}

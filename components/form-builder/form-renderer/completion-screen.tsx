"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface CompletionScreenProps {
  formTitle: string;
  earnedExperience: number;
  answeredQuestions: number;
  totalQuestions: number;
  redirectUrl: string;
}

export function CompletionScreen({
  formTitle,
  earnedExperience,
  answeredQuestions,
  totalQuestions,
  redirectUrl,
}: CompletionScreenProps) {
  const router = useRouter();
  const [experienceAnimationComplete, setExperienceAnimationComplete] =
    useState(false);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleAnimationComplete = () => {
    setExperienceAnimationComplete(true);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex justify-center items-center">
          <Check className="h-6 w-6 text-green-500 mr-2" />
          Form Completed!
        </CardTitle>
        <CardDescription>
          Great job completing the {formTitle} form!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-50 text-green-600">
            <Award className="h-12 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Experience Earned</p>
          <div className="flex items-center justify-center gap-2">
            <AnimatePresence>
              {!experienceAnimationComplete ? (
                <motion.span
                  className="text-3xl font-bold text-amber-500"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8 }}
                  onAnimationComplete={handleAnimationComplete}
                >
                  +{earnedExperience}
                </motion.span>
              ) : (
                <span className="text-3xl font-bold text-amber-500">
                  +{earnedExperience}
                </span>
              )}
            </AnimatePresence>
            <span className="text-xl font-semibold">XP</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Questions Answered</p>
          <p className="text-xl font-semibold">
            {answeredQuestions} / {totalQuestions}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="sport"
          className="w-full"
          onClick={() => router.push(redirectUrl)}
        >
          Great!
        </Button>
      </CardFooter>
    </Card>
  );
}

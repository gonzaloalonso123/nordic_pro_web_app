"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FormCompletionProps {
  formTitle: string;
  experienceEarned: number;
  questionsAnswered: number;
  totalQuestions: number;
  redirectPath: string;
  animate?: boolean;
}

export default function FormCompletion({
  formTitle,
  experienceEarned,
  questionsAnswered,
  totalQuestions,
  redirectPath,
  animate = false,
}: FormCompletionProps) {
  const router = useRouter();
  const [experienceAnimationComplete, setExperienceAnimationComplete] = useState(!animate);

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
              {!experienceAnimationComplete && animate ? (
                <motion.span
                  className="text-3xl font-bold text-amber-500"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8 }}
                  onAnimationComplete={handleAnimationComplete}
                >
                  +{experienceEarned}
                </motion.span>
              ) : (
                <span className="text-3xl font-bold text-amber-500">
                  +{experienceEarned}
                </span>
              )}
            </AnimatePresence>
            <span className="text-xl font-semibold">XP</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Questions Answered</p>
          <p className="text-xl font-semibold">
            {questionsAnswered} / {totalQuestions}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(redirectPath)}
        >
          Back to Forms
        </Button>
      </CardFooter>
    </Card>
  );
}
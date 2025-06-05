"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "./progress-indicator";
import { CompletionScreen } from "./completion-screen";
import type { FormWithQuestions, FormProgress } from "../types";
import { QuestionRenderer } from "./question-renderer";

interface SequentialFormProps {
  form: FormWithQuestions;
  redirectUrl?: string;
  onSubmit: (answers: Record<string, any>, experience: number) => void;
}

export default function SequentialForm({
  form,
  redirectUrl,
  onSubmit,
}: SequentialFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState<FormProgress>({
    formId: form.id,
    currentQuestionIndex: 0,
    answeredQuestions: [],
    completed: false,
    earnedExperience: 0,
  });
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const currentQuestion = form.questions[currentQuestionIndex];
  const totalQuestions = form.questions.length;
  const progressPercentage = Math.round(
    (progress.answeredQuestions.length / totalQuestions) * 100
  );

  const handleNextQuestion = () => {
    if (!progress.answeredQuestions.includes(currentQuestion.id)) {
      const updatedProgress = {
        ...progress,
        answeredQuestions: [...progress.answeredQuestions, currentQuestion.id],
        earnedExperience:
          progress.earnedExperience + currentQuestion.experience,
        currentQuestionIndex: currentQuestionIndex + 1,
      };
      setProgress(updatedProgress);
    } else {
      setProgress({
        ...progress,
        currentQuestionIndex: currentQuestionIndex + 1,
      });
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeForm();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setProgress({
        ...progress,
        currentQuestionIndex: currentQuestionIndex - 1,
      });
    }
  };

  const completeForm = () => {
    let updatedProgress = { ...progress };
    // Asegura que la última pregunta esté en answeredQuestions
    if (!updatedProgress.answeredQuestions.includes(currentQuestion.id)) {
      updatedProgress = {
        ...updatedProgress,
        answeredQuestions: [...updatedProgress.answeredQuestions, currentQuestion.id],
        earnedExperience: updatedProgress.earnedExperience + currentQuestion.experience,
      };
    }
    setShowCompletionScreen(true);
    setProgress({
      ...updatedProgress,
      completed: true,
    });
    onSubmit(answers, updatedProgress.earnedExperience);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  if (showCompletionScreen) {
    return (
      <CompletionScreen
        formTitle={form.title}
        earnedExperience={progress.earnedExperience}
        answeredQuestions={progress.answeredQuestions.length}
        totalQuestions={totalQuestions}
        redirectUrl={redirectUrl || "/"}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto overflow-hidden">
      <ProgressIndicator
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        earnedExperience={progress.earnedExperience}
        progressPercentage={progressPercentage}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <QuestionRenderer
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(value) =>
                  handleAnswerChange(currentQuestion.id, value)
                }
              />
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={
                  currentQuestion.required && !answers[currentQuestion.id]
                }
                className="flex items-center"
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  "Complete"
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

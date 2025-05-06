"use client";

import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Award, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { FormWithQuestions, Question, FormProgress } from "../types";
import EmojiPicker from "../input-types/emoji-picker";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useParams, useRouter } from "next/navigation";
import flags from "@/flags.json";

interface SequentialFormProps {
  form: FormWithQuestions;
}

export default function SequentialForm({ form }: SequentialFormProps) {
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
  const [experienceAnimationComplete, setExperienceAnimationComplete] =
    useState(false);
  const router = useRouter();
  const params = useParams();

  const baseUrl = `${flags.current_app}/admin`;

  const currentQuestion = form.questions[currentQuestionIndex];
  const totalQuestions = form.questions.length;
  const progressPercentage = Math.round(
    (progress.answeredQuestions.length / totalQuestions) * 100
  );

  const handleNextQuestion = () => {
    // Add current question to answered questions if not already there
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

    // Move to next question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Form is complete
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
    setShowCompletionScreen(true);

    const updatedProgress = {
      ...progress,
      completed: true,
    };
    setProgress(updatedProgress);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      onSubmit(answers);
    }, 500);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleAnimationComplete = () => {
    setExperienceAnimationComplete(true);
  };

  const renderQuestionInput = (question: Question) => {
    const value = answers[question.id];

    switch (question.input_type) {
      case "text":
        return (
          <Input
            placeholder="Enter your answer"
            value={value || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            min={question.min_value}
            max={question.max_value}
            value={value || ""}
            onChange={(e) =>
              handleAnswerChange(question.id, Number.parseFloat(e.target.value))
            }
          />
        );

      case "emoji":
        return (
          <EmojiPicker
            value={typeof value === "object" ? value.emoji : value}
            customOptions={question.emojiOptions}
            onChange={(emoji, numericValue) => {
              const newValue = question.emojiOptions
                ? { emoji, value: numericValue }
                : emoji;
              handleAnswerChange(question.id, newValue);
            }}
          />
        );

      case "slider":
        return (
          <div className="pt-4 pb-2">
            <Slider
              value={[value !== undefined ? value : question.min_value || 0]}
              min={question.min_value || 0}
              max={question.max_value || 100}
              step={question.step_value || 1}
              onValueChange={(val) => handleAnswerChange(question.id, val[0])}
            />
          </div>
        );

      case "yesno":
        return (
          <RadioGroup
            value={value !== undefined ? value.toString() : undefined}
            onValueChange={(val) =>
              handleAnswerChange(question.id, val === "true")
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "multiple":
        return (
          <div className="space-y-2">
            {question.question_options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (checked) {
                      handleAnswerChange(question.id, [
                        ...currentValues,
                        option.value,
                      ]);
                    } else {
                      handleAnswerChange(
                        question.id,
                        currentValues.filter((v: string) => v !== option.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            placeholder="Enter your answer"
            value={value || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );
    }
  };

  if (showCompletionScreen) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex justify-center items-center">
            <Check className="h-6 w-6 text-green-500 mr-2" />
            Form Completed!
          </CardTitle>
          <CardDescription>
            Great job completing the {form.title} form!
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
                    +{progress.earnedExperience}
                  </motion.span>
                ) : (
                  <span className="text-3xl font-bold text-amber-500">
                    +{progress.earnedExperience}
                  </span>
                )}
              </AnimatePresence>
              <span className="text-xl font-semibold">XP</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Questions Answered</p>
            <p className="text-xl font-semibold">
              {progress.answeredQuestions.length} / {totalQuestions}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`${baseUrl}/forms`)}
          >
            Back to Forms
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              {progress.earnedExperience} XP
            </span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            {currentQuestion.imageUrl && (
              <div className="relative w-full h-48 sm:h-64">
                <Image
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt={currentQuestion.question}
                  fill
                  className="object-contain rounded-t-lg"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.description && (
                    <CardDescription className="mt-1">
                      {currentQuestion.description}
                    </CardDescription>
                  )}
                </div>
                <Badge variant="outline" className="bg-amber-50">
                  <Award className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  {currentQuestion.experience} XP
                </Badge>
              </div>
            </CardHeader>
            <CardContent>{renderQuestionInput(currentQuestion)}</CardContent>
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

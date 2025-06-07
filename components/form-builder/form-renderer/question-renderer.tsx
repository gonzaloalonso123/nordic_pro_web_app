"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import Image from "next/image";
import EmojiPicker from "../input-types/emoji-picker";
import KidSlider from "@/components/ui/kid-slider";

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  showExperienceBadge?: boolean;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  showExperienceBadge = true,
}: QuestionRendererProps) {
  const renderQuestionInput = () => {
    switch (question.input_type) {
      case "text":
        return (
          <Input
            placeholder="Enter your answer"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
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
            onChange={(e) => onChange(Number.parseFloat(e.target.value))}
          />
        );

      case "emoji":
        return (
          <EmojiPicker
            value={typeof value === "object" ? value.emoji : value}
            onChange={(emoji) => {
              onChange(emoji);
            }}
          />
        );

      case "slider":
        return (
          <div className="pt-4 pb-2">
            <KidSlider
              value={[value !== undefined ? value : question.min_value || 0]}
              min={question.min_value || 0}
              max={question.max_value || 100}
              step={question.step_value || 1}
              onValueChange={(val) => onChange(val[0])}
            />
          </div>
        );

      case "yesno":
        return (
          <RadioGroup
            value={value !== undefined ? value.toString() : undefined}
            onValueChange={(val) => onChange(val === "true")}
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
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(
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
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {question.image_url && (
        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden">
          <Image
            src={question.image_url || "/placeholder.svg"}
            alt={question.question}
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium">{question.question}</h3>
          {question.description && (
            <p className="text-sm text-muted-foreground">
              {question.description}
            </p>
          )}
        </div>

        {showExperienceBadge && (
          <Badge variant="outline" className="bg-amber-50">
            <Award className="h-3.5 w-3.5 mr-1 text-amber-500" />
            {question.experience} XP
          </Badge>
        )}
      </div>

      <div>{renderQuestionInput()}</div>
    </div>
  );
}

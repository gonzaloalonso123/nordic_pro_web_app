import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import EmojiPicker from "../input-types/emoji-picker";
import type { Question } from "../types";
import React from "react";

// Build validation schema based on questions
export const buildValidationSchema = (questions: Question[]) => {
  const schema: Record<string, any> = {};

  questions.forEach((question) => {
    let fieldSchema;

    switch (question.inputType) {
      case "text":
        fieldSchema = z.string();
        break;
      case "number":
        fieldSchema = z.number();
        if (question.min !== undefined)
          fieldSchema = fieldSchema.min(question.min);
        if (question.max !== undefined)
          fieldSchema = fieldSchema.max(question.max);
        break;
      case "emoji":
        fieldSchema = z.string();
        break;
      case "slider":
        fieldSchema = z.number();
        break;
      case "yesno":
        fieldSchema = z.boolean();
        break;
      case "multiple":
        fieldSchema = z.array(z.string()).min(1);
        break;
      default:
        fieldSchema = z.string();
    }

    if (question.required) {
      schema[question.id] = fieldSchema;
    } else {
      schema[question.id] = fieldSchema.optional();
    }
  });

  return z.object(schema);
};

// Shared input rendering logic
export const renderQuestionInput = (
  question: Question,
  readOnly: boolean,
  value?: any,
  onChange?: (value: any) => void
) => {
  switch (question.inputType) {
    case "text":
      return (
        <Input 
          placeholder="Enter your answer" 
          disabled={readOnly} 
          value={value || ""}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder="Enter a number"
          min={question.min}
          max={question.max}
          disabled={readOnly}
          value={value || ""}
          onChange={onChange ? (e) => onChange(Number.parseFloat(e.target.value)) : undefined}
        />
      );

    case "emoji":
      return (field: any) => {
        const emojiValue = field?.value?.emoji || field?.value || value?.emoji || value;
        return (
          <EmojiPicker
            disabled={readOnly}
            value={emojiValue}
            customOptions={question.emojiOptions}
            onChange={(emoji, numericValue) => {
              // Store both the emoji and its numeric value
              const newValue = question.emojiOptions 
                ? { emoji, value: numericValue } 
                : emoji;
              
              if (onChange) {
                onChange(newValue);
              } else if (field?.onChange) {
                field.onChange(newValue);
              }
            }}
          />
        );
      };

    case "slider":
      return (field: any) => {
        const currentValue = field?.value !== undefined ? field.value : (value !== undefined ? value : question.min || 0);
        return (
          <div className="pt-4 pb-2">
            <Slider
              disabled={readOnly}
              value={[currentValue]}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              onValueChange={(val) => {
                if (onChange) {
                  onChange(val[0]);
                } else if (field?.onChange) {
                  field.onChange(val[0]);
                }
              }}
            />
          </div>
        );
      };

    case "yesno":
      return (field: any) => {
        const currentValue = field?.value !== undefined 
          ? field.value.toString() 
          : (value !== undefined ? value.toString() : undefined);
        
        return (
          <RadioGroup
            disabled={readOnly}
            value={currentValue}
            onValueChange={(val) => {
              const boolValue = val === "true";
              if (onChange) {
                onChange(boolValue);
              } else if (field?.onChange) {
                field.onChange(boolValue);
              }
            }}
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
      };

    case "multiple":
      return (field: any) => {
        const currentValues = field?.value || value || [];
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  disabled={readOnly}
                  checked={Array.isArray(currentValues) && currentValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const values = Array.isArray(currentValues) ? currentValues : [];
                    let newValues;
                    
                    if (checked) {
                      newValues = [...values, option.value];
                    } else {
                      newValues = values.filter((v: string) => v !== option.value);
                    }
                    
                    if (onChange) {
                      onChange(newValues);
                    } else if (field?.onChange) {
                      field.onChange(newValues);
                    }
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      };

    default:
      return (
        <Input 
          placeholder="Enter your answer" 
          disabled={readOnly} 
          value={value || ""}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      );
  }
};

// Utility for updating user experience
export const updateUserExperience = (formId: string, points: number) => {
  // Get current user profile or create a new one
  const storedProfile = localStorage.getItem("user-profile");
  const profile = storedProfile
    ? JSON.parse(storedProfile)
    : {
        id: "current-user",
        totalExperience: 0,
        completedForms: [],
      };

  // Check if form already completed
  if (!profile.completedForms.includes(formId)) {
    profile.totalExperience += points;
    profile.completedForms.push(formId);
    localStorage.setItem("user-profile", JSON.stringify(profile));
  }

  return points;
};
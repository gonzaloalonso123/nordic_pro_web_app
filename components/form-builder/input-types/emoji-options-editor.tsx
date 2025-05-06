"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, RefreshCw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { EmojiOption } from "../types";
import EmojiPicker from "./emoji-picker";

interface EmojiOptionsEditorProps {
  options: EmojiOption[];
  onChange: (options: EmojiOption[]) => void;
}

// Default 5-point emoji scale
const defaultEmojiScale: Omit<EmojiOption, "id">[] = [
  { emoji: "😢", value: 1, label: "Very Dissatisfied" },
  { emoji: "🙁", value: 2, label: "Dissatisfied" },
  { emoji: "😐", value: 3, label: "Neutral" },
  { emoji: "🙂", value: 4, label: "Satisfied" },
  { emoji: "😄", value: 5, label: "Very Satisfied" },
];

export default function EmojiOptionsEditor({
  options,
  onChange,
}: EmojiOptionsEditorProps) {
  const [newOptions, setNewOptions] = useState<EmojiOption[]>(options || []);

  // Initialize with default scale if no options provided
  useEffect(() => {
    if (options.length === 0) {
      resetToDefaultScale();
    }
  }, []);

  const resetToDefaultScale = () => {
    const defaultOptions = defaultEmojiScale.map((option) => ({
      ...option,
      id: uuidv4(),
    }));
    setNewOptions(defaultOptions);
    onChange(defaultOptions);
  };

  const handleAddOption = () => {
    const newOption: EmojiOption = {
      id: uuidv4(),
      emoji: "",
      value: newOptions.length + 1, // Default value is the next number
      label: "",
    };
    const updatedOptions = [...newOptions, newOption];
    setNewOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const handleRemoveOption = (id: string) => {
    const updatedOptions = newOptions.filter((option) => option.id !== id);
    // Update values to match index if needed
    const reindexedOptions = updatedOptions.map((option, index) => ({
      ...option,
      value: option.value !== index + 1 ? option.value : index + 1, // Only auto-update if it was using the default index
    }));
    setNewOptions(reindexedOptions);
    onChange(reindexedOptions);
  };

  const handleOptionChange = (
    id: string,
    field: keyof EmojiOption,
    value: string | number
  ) => {
    const updatedOptions = newOptions.map((option) =>
      option.id === id ? { ...option, [field]: value } : option
    );
    setNewOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const handleEmojiSelect = (id: string, emoji: string) => {
    handleOptionChange(id, "emoji", emoji);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Emoji Options</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetToDefaultScale}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default Scale
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </div>

      {newOptions.length === 0 ? (
        <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
          No emoji options added yet. Click "Reset to Default Scale" to add the
          standard 5-point scale.
        </div>
      ) : (
        <div className="space-y-4">
          {newOptions.map((option, index) => (
            <div
              key={option.id}
              className="flex gap-3 items-start p-3 border rounded-md bg-muted/20"
            >
              <div className="flex-shrink-0">
                <EmojiPicker
                  value={option.emoji}
                  onChange={(emoji) => handleEmojiSelect(option.id, emoji)}
                  showValues={false}
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label
                    htmlFor={`value-${option.id}`}
                    className="text-xs font-medium block mb-1"
                  >
                    Value
                  </label>
                  <Input
                    id={`value-${option.id}`}
                    type="number"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(
                        option.id,
                        "value",
                        Number(e.target.value)
                      )
                    }
                    className="h-8"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`label-${option.id}`}
                    className="text-xs font-medium block mb-1"
                  >
                    Label (optional)
                  </label>
                  <Input
                    id={`label-${option.id}`}
                    value={option.label || ""}
                    onChange={(e) =>
                      handleOptionChange(option.id, "label", e.target.value)
                    }
                    placeholder="Description for this emoji"
                    className="h-8"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(option.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-2">
        Each emoji option has a numeric value that will be stored when the user
        selects it.
      </div>
    </div>
  );
}

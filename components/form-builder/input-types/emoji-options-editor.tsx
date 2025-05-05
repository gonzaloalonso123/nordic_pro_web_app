"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import type { EmojiOption } from "../types";
import EmojiPicker from "./emoji-picker";

interface EmojiOptionsEditorProps {
  options: EmojiOption[];
  onChange: (options: EmojiOption[]) => void;
}

export default function EmojiOptionsEditor({
  options,
  onChange,
}: EmojiOptionsEditorProps) {
  const [newOptions, setNewOptions] = useState<EmojiOption[]>(options || []);

  const handleAddOption = () => {
    const newOption: EmojiOption = {
      id: Math.random().toString(36).substr(2, 9),
      emoji: "",
      value: newOptions.length, // Default value is the index
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
      value: option.value !== index ? option.value : index, // Only auto-update if it was using the default index
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Emoji Option
        </Button>
      </div>

      {newOptions.length === 0 ? (
        <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
          No emoji options added yet. Click "Add Emoji Option" to create
          options.
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

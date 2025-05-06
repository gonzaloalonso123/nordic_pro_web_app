"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import type { EmojiOption } from "../types";
import { Badge } from "@/components/ui/badge";

// Default emoji categories if no custom options are provided
const DEFAULT_EMOJI_CATEGORIES = [
  {
    name: "Smileys & Emotion",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
    ],
  },
  {
    name: "People & Body",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
    ],
  },
  {
    name: "Animals & Nature",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
    ],
  },
  {
    name: "Food & Drink",
    emojis: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
    ],
  },
  {
    name: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
    ],
  },
];

interface EmojiPickerProps {
  value?: string;
  onChange?: (value: string, numericValue?: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  customOptions?: EmojiOption[];
  showValues?: boolean;
  editMode?: boolean;
}

export default function EmojiPicker({
  value,
  onChange,
  onBlur,
  disabled = false,
  customOptions,
  showValues = true,
  editMode = false,
}: EmojiPickerProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(value || "");
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);

  // Find the numeric value for the selected emoji when it changes
  useEffect(() => {
    if (customOptions && selectedEmoji) {
      const option = customOptions.find((opt) => opt.emoji === selectedEmoji);
      if (option) {
        setSelectedValue(option.value);
      }
    }
  }, [selectedEmoji, customOptions]);

  const handleEmojiSelect = (emoji: string, numericValue?: number) => {
    setSelectedEmoji(emoji);
    setSelectedValue(numericValue);
    if (onChange) onChange(emoji, numericValue);
    setOpen(false);
    if (onBlur) onBlur();
  };

  // Render custom emoji options if provided
  const renderCustomOptions = () => {
    if (!customOptions || customOptions.length === 0) {
      return (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No emoji options defined. {editMode ? "Add some options below." : ""}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {customOptions.map((option) => (
          <button
            key={option.id}
            className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => handleEmojiSelect(option.emoji, option.value)}
            type="button"
            disabled={disabled}
          >
            <span className="text-2xl mb-1">{option.emoji}</span>
            {showValues && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {option.value}
              </Badge>
            )}
            {option.label && (
              <span className="text-xs mt-1 text-center">{option.label}</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  // Render default emoji categories
  const renderDefaultCategories = () => {
    return (
      <div className="max-h-[300px] overflow-y-auto p-3">
        {DEFAULT_EMOJI_CATEGORIES.map((category) => (
          <div key={category.name} className="mb-4">
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              {category.name}
            </h5>
            <div className="grid grid-cols-7 gap-1">
              {category.emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="h-8 w-8 flex items-center justify-center text-lg rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => handleEmojiSelect(emoji)}
                  type="button"
                  disabled={disabled}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-xl"
        aria-label={
          selectedEmoji
            ? `Selected emoji: ${selectedEmoji}`
            : "No emoji selected"
        }
      >
        {selectedEmoji || <Smile className="h-5 w-5 text-muted-foreground" />}
      </div>

      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 justify-start text-left font-normal"
            disabled={disabled}
          >
            {selectedEmoji ? (
              <div className="flex items-center gap-2">
                <span>{selectedEmoji}</span>
                {selectedValue !== undefined && showValues && (
                  <Badge variant="secondary" className="ml-2">
                    Value: {selectedValue}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">Select an emoji</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <h4 className="font-medium text-sm">
              {customOptions ? "Select an emoji response" : "Pick an emoji"}
            </h4>
          </div>

          {customOptions ? renderCustomOptions() : renderDefaultCategories()}
        </PopoverContent>
      </Popover>
    </div>
  );
}

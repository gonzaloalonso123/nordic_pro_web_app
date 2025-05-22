"use client";

import { useState } from "react";

const EMOJIS = [
  { emoji: "😢", value: 1, label: "Very Sad" },
  { emoji: "😔", value: 2, label: "Sad" },
  { emoji: "😐", value: 3, label: "Neutral" },
  { emoji: "🙂", value: 4, label: "Happy" },
  { emoji: "😄", value: 5, label: "Very Happy" },
];

interface EmojiRowProps {
  value?: string;
  onChange?: (value: string, numericValue?: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export default function EmojiRow({
  value,
  onChange,
  onBlur,
  disabled = false,
}: EmojiRowProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(value || "");

  const handleEmojiSelect = (emoji: string, numericValue?: number) => {
    setSelectedEmoji(emoji);
    if (onChange) onChange(emoji, numericValue);
    if (onBlur) onBlur();
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
      {EMOJIS.map((option) => (
        <button
          key={option.value}
          className={`text-4xl sm:text-4xl p-3 rounded-md transition-all ${
            selectedEmoji === option.emoji
              ? "bg-primary/10 scale-110"
              : "hover:bg-muted"
          }`}
          onClick={() => handleEmojiSelect(option.emoji, option.value)}
          type="button"
          disabled={disabled}
          aria-label={option.label}
          title={option.label}
        >
          {option.emoji}
        </button>
      ))}
    </div>
  );
}

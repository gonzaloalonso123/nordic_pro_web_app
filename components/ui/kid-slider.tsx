"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface KidSliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export default function KidSlider({
  value: externalValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = "",
}: KidSliderProps) {
  const [value, setValue] = useState(
    externalValue !== undefined ? externalValue : min
  );
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync with external value
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
    }
  }, [externalValue]);

  // Calculate percentage for positioning
  const percentage = ((value - min) / (max - min)) * 100;

  // Get color based on value percentage
  const getHandleColor = () => {
    if (percentage < 20) return "bg-red-500";
    if (percentage < 40) return "bg-orange-500";
    if (percentage < 60) return "bg-yellow-500";
    if (percentage < 80) return "bg-lime-500";
    return "bg-green-500";
  };

  // Handle click on track
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const trackWidth = rect.width;

    // Calculate new value based on click position
    let newValue = min + (clickPosition / trackWidth) * (max - min);

    // Apply step
    newValue = Math.round(newValue / step) * step;

    // Clamp value between min and max
    newValue = Math.max(min, Math.min(max, newValue));

    setValue(newValue);
    onChange?.(newValue);
  };

  // Update value based on drag position
  const updateValueFromDrag = (x: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const trackWidth = rect.width;

    // Calculate position relative to track
    const position = Math.max(0, Math.min(trackWidth, x - rect.left));

    // Calculate new value based on position
    let newValue = min + (position / trackWidth) * (max - min);

    // Apply step
    newValue = Math.round(newValue / step) * step;

    // Clamp value
    newValue = Math.max(min, Math.min(max, newValue));

    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`w-full py-8 px-2 ${className}`}>
      <div
        ref={trackRef}
        className="relative h-8 bg-linear-to-r from-red-400 via-yellow-400 to-green-400 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        <div className="absolute inset-0 flex justify-between px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-full flex items-center">
              <div className="h-8 w-2 bg-white/30 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${Math.max(0, Math.min(100, percentage))}%`,
              x: "-50%", // Center the handle on the percentage point
            }}
            animate={{
              scale: isDragging ? 1.2 : 1,
              y: isDragging ? -10 : "-50%",
            }}
            whileHover={{ scale: 1.1, y: "-60%" }}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
          >
            <div
              className={`w-[40px] h-[40px] rounded-full shadow-lg border-4 border-white cursor-grab active:cursor-grabbing ${getHandleColor()}`}
              style={{ touchAction: "none" }}
            />
          </motion.div>
        </div>
      </div>

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => {
          setIsDragging(true);
          updateValueFromDrag(e.clientX);

          const handlePointerMove = (e: PointerEvent) => {
            updateValueFromDrag(e.clientX);
          };

          const handlePointerUp = () => {
            setIsDragging(false);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
          };

          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
        }}
      />

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-bold">{min}</div>
        <div className="text-2xl font-bold bg-blue-100 px-4 py-2 rounded-full border-2 border-blue-500">
          {value}
        </div>
        <div className="text-xl font-bold">{max}</div>
      </div>
    </div>
  );
}

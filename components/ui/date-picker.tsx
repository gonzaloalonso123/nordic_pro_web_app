"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  formatDate,
  getDaysInMonth,
  getMonthName,
  getWeekdayName,
  getYearsRange,
} from "@/lib/date-utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  showTime?: boolean;
  enableYearNavigation?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  showTime = false,
  enableYearNavigation = false,
  minDate,
  maxDate,
  placeholder = "Select date",
  disabled = false,
  className = "",
}: DatePickerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [hours, setHours] = useState(
    selectedDate ? selectedDate.getHours() % 12 || 12 : 12
  );
  const [minutes, setMinutes] = useState(
    selectedDate ? selectedDate.getMinutes() : 0
  );
  const [ampm, setAmpm] = useState(
    selectedDate ? (selectedDate.getHours() >= 12 ? "PM" : "AM") : "AM"
  );
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
      setHours(value.getHours() % 12 || 12);
      setMinutes(value.getMinutes());
      setAmpm(value.getHours() >= 12 ? "PM" : "AM");
    }
  }, [value]);

  // Improved click away listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!datePickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);

    if (selectedDate) {
      newDate.setHours(
        ampm === "PM"
          ? hours === 12
            ? 12
            : hours + 12
          : hours === 12
            ? 0
            : hours,
        minutes
      );
    }

    setSelectedDate(newDate);

    if (onChange) {
      onChange(newDate);
    }

    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(
        ampm === "PM"
          ? hours === 12
            ? 12
            : hours + 12
          : hours === 12
            ? 0
            : hours,
        minutes
      );

      setSelectedDate(newDate);

      if (onChange) {
        onChange(newDate);
      }
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);
    }
  };

  const incrementHours = () => {
    setHours((prev) => (prev % 12) + 1);
  };

  const decrementHours = () => {
    setHours((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const incrementMinutes = () => {
    setMinutes((prev) => (prev + 1) % 60);
  };

  const decrementMinutes = () => {
    setMinutes((prev) => (prev === 0 ? 59 : prev - 1));
  };

  const toggleAmPm = () => {
    setAmpm((prev) => (prev === "AM" ? "PM" : "AM"));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setShowYearDropdown(false);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    setShowMonthDropdown(false);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    handleDateClick(today.getDate());
  };

  // Handle native date input change
  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-").map(Number);
      const newDate = new Date(year, month - 1, day);

      // If we have a time component, preserve it
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      }

      setSelectedDate(newDate);

      if (onChange) {
        onChange(newDate);
      }
    }
  };

  // Handle native time input change
  const handleNativeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && selectedDate) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);

      setSelectedDate(newDate);

      if (onChange) {
        onChange(newDate);
      }
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const isDisabled =
        (minDate && date < minDate) || (maxDate && date > maxDate);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateClick(day)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
            ${isToday ? "bg-gray-100 font-medium" : ""}
            ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"}
            ${isDisabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
          `}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderYearDropdown = () => {
    const years = getYearsRange(currentYear);

    return (
      <div
        ref={yearDropdownRef}
        className="absolute z-10 mt-1 w-24 bg-background border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <div className="py-1">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearChange(year)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100
                ${year === currentYear ? "bg-gray-100 font-medium" : ""}
              `}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthDropdown = () => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: getMonthName(i),
    }));

    return (
      <div
        ref={monthDropdownRef}
        className="absolute z-10 mt-1 w-32 bg-background border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <div className="py-1">
          {months.map((month) => (
            <button
              key={month.value}
              type="button"
              onClick={() => handleMonthChange(month.value)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100
                ${month.value === currentMonth ? "bg-gray-100 font-medium" : ""}
              `}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Format date for native input (YYYY-MM-DD)
  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format time for native input (HH:MM)
  const formatTimeForInput = (date?: Date) => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Render native mobile datepicker
  if (isMobile) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={handleNativeDateChange}
              className="w-full pl-10 pr-3 py-2 border rounded-md"
              disabled={disabled}
              min={minDate ? formatDateForInput(minDate) : undefined}
              max={maxDate ? formatDateForInput(maxDate) : undefined}
            />
          </div>

          {showTime && (
            <div className="relative">
              <input
                type="time"
                value={formatTimeForInput(selectedDate)}
                onChange={handleNativeTimeChange}
                className="w-full pl-3 pr-3 py-2 border rounded-md"
                disabled={disabled || !selectedDate}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render custom desktop datepicker
  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <div
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
        <span className={`flex-grow ${!selectedDate ? "text-gray-400" : ""}`}>
          {selectedDate ? formatDate(selectedDate, showTime) : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 p-4 bg-background border border-gray-200 rounded-md shadow-lg w-[320px]">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center text-sm font-medium hover:text-blue-600"
                >
                  {getMonthName(currentMonth)}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {showMonthDropdown && renderMonthDropdown()}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    enableYearNavigation &&
                    setShowYearDropdown(!showYearDropdown)
                  }
                  className={`flex items-center text-sm font-medium ${enableYearNavigation ? "hover:text-blue-600" : ""}`}
                >
                  {currentYear}
                  {enableYearNavigation && (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
                {showYearDropdown &&
                  enableYearNavigation &&
                  renderYearDropdown()}
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-full ml-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                >
                  {getWeekdayName(day)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
          </div>

          {showTime && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative flex flex-col items-center">
                    <button
                      type="button"
                      onClick={incrementHours}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <Input
                      type="text"
                      value={hours.toString().padStart(2, "0")}
                      onChange={handleHoursChange}
                      onBlur={handleTimeChange}
                      className="w-12 text-center p-1"
                    />
                    <button
                      type="button"
                      onClick={decrementHours}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="mx-1 text-lg">:</span>

                  <div className="relative flex flex-col items-center">
                    <button
                      type="button"
                      onClick={incrementMinutes}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <Input
                      type="text"
                      value={minutes.toString().padStart(2, "0")}
                      onChange={handleMinutesChange}
                      onBlur={handleTimeChange}
                      className="w-12 text-center p-1"
                    />
                    <button
                      type="button"
                      onClick={decrementMinutes}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAmPm}
                    className="ml-2 px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    {ampm}
                  </button>
                </div>

                <Button type="button" size="sm" onClick={handleTimeChange}>
                  Apply
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToday}
            >
              Today
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

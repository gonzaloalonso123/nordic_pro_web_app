import { addDays, format, subDays } from "date-fns";

// Generate dates for the last 30 days
const generateDates = (count: number) => {
  const today = new Date();
  return Array.from({ length: count }).map((_, i) => {
    const date = subDays(today, count - i - 1);
    return format(date, "MMM dd");
  });
};

const dates = generateDates(10);

// Mock attendance data
export const mockAttendanceData = dates.map((date) => ({
  date,
  present: Math.floor(Math.random() * 15) + 10, // 10-25 players present
  late: Math.floor(Math.random() * 5), // 0-5 players late
  absent: Math.floor(Math.random() * 3), // 0-3 players absent
}));

// Mock mood data
const moods = ["😢", "🙁", "😐", "🙂", "😄"];
export const mockMoodData = dates.flatMap((date) =>
  moods.map((mood) => ({
    date,
    mood,
    count: Math.floor(Math.random() * (mood === "😐" || mood === "🙂" ? 10 : 5) + 1),
  }))
);

// Mock team feeling data (1-5 scale)
export const mockTeamFeelingData = dates.map((date) => ({
  date,
  feeling: Math.min(5, Math.max(1, 3 + (Math.random() - 0.5) * 2.5)),
}));

// Mock hook to replace useTeam
export const useMockTeamData = () => {
  return {
    attendanceData: mockAttendanceData,
    moodData: mockMoodData,
    teamFeelingData: mockTeamFeelingData,
  };
};
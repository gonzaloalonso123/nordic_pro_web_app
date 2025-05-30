"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMockTeamData } from "./mock-data";
import { Content } from "@/components/content";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AnalyticsTab() {
  const { attendanceData, moodData, teamFeelingData } = useMockTeamData();
  const isMobile = useIsMobile();

  const moodsByDate = moodData.reduce(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {};
      }
      acc[item.date][item.mood] = item.count;
      return acc;
    },
    {} as Record<string, Record<string, number>>
  );

  const moodChartData = Object.entries(moodsByDate).map(([date, moods]) => ({
    date,
    "😢": moods["😢"] || 0,
    "🙁": moods["🙁"] || 0,
    "😐": moods["😐"] || 0,
    "🙂": moods["🙂"] || 0,
    "😄": moods["😄"] || 0,
  }));

  // Colors for mood chart
  const MOOD_COLORS = {
    "😢": "#ff6b6b",
    "🙁": "#ffa06b",
    "😐": "#ffd56b",
    "🙂": "#a0ff6b",
    "😄": "#6bff6b",
  };

  // Colors for feeling chart
  const FEELING_COLORS = [
    "#ff6b6b",
    "#ffa06b",
    "#ffd56b",
    "#a0ff6b",
    "#6bff6b",
  ];

  return (
    <Content>
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="feeling">Team Feeling</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Attendance</CardTitle>
              <CardDescription>
                Track attendance and punctuality for training sessions
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`${isMobile ? "h-[300px]" : "h-[400px]"} px-1 sm:px-6`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis width={30} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Bar dataKey="present" name="Present" fill="#4ade80" />
                  <Bar dataKey="late" name="Late" fill="#facc15" />
                  <Bar dataKey="absent" name="Absent" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Mood</CardTitle>
              <CardDescription>
                Mood distribution during training sessions
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`${isMobile ? "h-[300px]" : "h-[400px]"} px-1 sm:px-6`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={moodChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis width={30} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Bar dataKey="😢" fill={MOOD_COLORS["😢"]} />
                  <Bar dataKey="🙁" fill={MOOD_COLORS["🙁"]} />
                  <Bar dataKey="😐" fill={MOOD_COLORS["😐"]} />
                  <Bar dataKey="🙂" fill={MOOD_COLORS["🙂"]} />
                  <Bar dataKey="😄" fill={MOOD_COLORS["😄"]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeling" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Feeling</CardTitle>
              <CardDescription>
                Overall team feeling on a scale of 1-5
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`${isMobile ? "h-[300px]" : "h-[400px]"} px-1 sm:px-6`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={teamFeelingData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    width={30}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="feeling"
                    name="Team Feeling (1-5)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Content>
  );
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart } from "./charts/bar-chart"
import { LineChart } from "./charts/line-chart"
import { PieChart } from "./charts/pie-chart"
import { QuestionAnalyticsView } from "./question-analytics"
import { UserAnalyticsView } from "./user-analytics"
import { getFormAnalytics, getTimeSeriesData } from "./analytics-service"
import type { Form, Question, AnalyticsFilters, FormResponse } from "../types"
import { Search } from "lucide-react"
import { addDays } from "date-fns"

interface FormAnalyticsDashboardProps {
  form: Form
  questions: Question[]
}

export function FormAnalyticsDashboard({ form, questions }: FormAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: addDays(new Date(), -30),
      end: new Date(),
    },
  })
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [responses, setResponses] = useState<FormResponse[]>([])

  // Load analytics data
  useEffect(() => {
    const formAnalytics = getFormAnalytics(form, questions, filters)
    setAnalytics(formAnalytics)

    // Get time series data for the form
    const timeSeries = getTimeSeriesData(formAnalytics.filteredResponses || [], undefined, form.id)
    setTimeSeriesData(timeSeries.data)

    // Store responses for later use
    setResponses(formAnalytics.filteredResponses || [])
  }, [form, questions, filters])

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  // Handle question selection
  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestionId(questionId)
    setActiveTab("question")

    // Get time series data for this question
    if (responses.length > 0) {
      const timeSeries = getTimeSeriesData(responses, questionId, form.id)
      setTimeSeriesData(timeSeries.data)
    }
  }

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
    setActiveTab("user")

    // Get time series data for this user
    if (responses.length > 0) {
      const userResponses = responses.filter((r) => r.userId === userId)
      const timeSeries = getTimeSeriesData(userResponses, undefined, form.id)
      setTimeSeriesData(timeSeries.data)
    }
  }

  if (!analytics) {
    return <div>Loading analytics...</div>
  }

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId)
  const selectedQuestionAnalytics = selectedQuestion
    ? analytics.questionAnalytics.find((qa: any) => qa.questionId === selectedQuestionId)
    : null

  const selectedUserAnalytics = selectedUserId
    ? analytics.userAnalytics.find((ua: any) => ua.userId === selectedUserId)
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{form.title} Analytics</h1>
          <p className="text-muted-foreground">
            {analytics.totalResponses} responses from {analytics.uniqueUsers} users
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <DatePickerWithRange
            value={{
              from: filters.dateRange?.start,
              to: filters.dateRange?.end,
            }}
            onChange={(range) => {
              if (range?.from && range?.to) {
                handleFilterChange({
                  dateRange: {
                    start: range.from,
                    end: range.to,
                  },
                })
              }
            }}
          />

          <Select
            value={filters.category || "all"}
            onValueChange={(value) => handleFilterChange({ category: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Array.from(new Set(questions.map((q) => q.category))).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          {selectedQuestionId && <TabsTrigger value="question">Question Detail</TabsTrigger>}
          {selectedUserId && <TabsTrigger value="user">User Detail</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.totalResponses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unique Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.uniqueUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Avg. Responses per User</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {analytics.uniqueUsers > 0 ? (analytics.totalResponses / analytics.uniqueUsers).toFixed(1) : "0"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LineChart
              data={timeSeriesData}
              xKey="label"
              yKey="value"
              title="Responses Over Time"
              description="Number of form submissions over time"
              color="#8884d8"
              height={300}
            />

            <PieChart
              data={analytics.questionAnalytics.map((qa: any) => ({
                name: qa.question.length > 30 ? qa.question.substring(0, 30) + "..." : qa.question,
                value: qa.totalResponses,
              }))}
              nameKey="name"
              valueKey="value"
              title="Responses by Question"
              description="Distribution of responses across questions"
              height={300}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Response Summary</CardTitle>
              <CardDescription>Key metrics from form responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.questionAnalytics.slice(0, 6).map((qa: any) => (
                  <Card key={qa.questionId} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{qa.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{qa.totalResponses} responses</span>
                        <Button variant="link" size="sm" onClick={() => handleQuestionSelect(qa.questionId)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Question Analytics</h2>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search questions..." className="pl-8" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {analytics.questionAnalytics.map((qa: any) => (
              <Card key={qa.questionId} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{qa.question}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleQuestionSelect(qa.questionId)}>
                      View Details
                    </Button>
                  </div>
                  <CardDescription>
                    {qa.category} • {qa.inputType} • {qa.totalResponses} responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    {qa.inputType === "text" && (
                      <div className="flex flex-wrap gap-2">
                        {qa.responseData.wordFrequency.slice(0, 10).map((word: any, i: number) => (
                          <div key={i} className="bg-muted px-2 py-1 rounded text-sm">
                            {word.word} ({word.count})
                          </div>
                        ))}
                      </div>
                    )}

                    {(qa.inputType === "number" || qa.inputType === "slider") && (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Min: {qa.responseData.min}</span>
                          <span>Max: {qa.responseData.max}</span>
                          <span>Avg: {qa.responseData.average.toFixed(1)}</span>
                        </div>
                      </div>
                    )}

                    {qa.inputType === "emoji" && (
                      <div className="flex gap-4">
                        {qa.responseData.emojiCounts.slice(0, 5).map((emoji: any, i: number) => (
                          <div key={i} className="text-center">
                            <div className="text-3xl">{emoji.emoji}</div>
                            <div className="text-sm">{emoji.count}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {qa.inputType === "yesno" && (
                      <div className="flex justify-around">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{qa.responseData.yes}</div>
                          <div>Yes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{qa.responseData.no}</div>
                          <div>No</div>
                        </div>
                      </div>
                    )}

                    {qa.inputType === "multiple" && (
                      <div className="space-y-2">
                        {qa.responseData.options.slice(0, 3).map((option: any, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span>{option.label}</span>
                            <span>
                              {option.count} ({option.percentageOfResponses.toFixed(1)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Analytics</h2>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.userAnalytics.map((ua: any) => (
              <Card key={ua.userId} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{ua.userName}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleUserSelect(ua.userId)}>
                      View Details
                    </Button>
                  </div>
                  <CardDescription>
                    {ua.totalResponses} responses • {ua.completedForms} forms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Categories:</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(ua.responsesByCategory)
                        .slice(0, 3)
                        .map(([category, count], i) => (
                          <div key={i} className="bg-muted px-2 py-1 rounded text-sm">
                            {category} ({count})
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Trends</CardTitle>
                <CardDescription>Form submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart data={timeSeriesData} xKey="label" yKey="value" title="" color="#8884d8" height={300} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={analytics.userAnalytics.slice(0, 10).map((ua: any) => ({
                      name: ua.userName,
                      responses: ua.totalResponses,
                    }))}
                    xKey="name"
                    yKey="responses"
                    title=""
                    color="#82ca9d"
                    height={300}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Trends</CardTitle>
              <CardDescription>Responses by category over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart
                  data={Array.from(new Set(questions.map((q) => q.category))).map((category) => {
                    const count = analytics.questionAnalytics
                      .filter((qa: any) => qa.category === category)
                      .reduce((sum: number, qa: any) => sum + qa.totalResponses, 0)
                    return { name: category, value: count }
                  })}
                  nameKey="name"
                  valueKey="value"
                  title=""
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {selectedQuestionAnalytics && (
          <TabsContent value="question" className="space-y-4">
            <QuestionAnalyticsView analytics={selectedQuestionAnalytics} timeSeriesData={timeSeriesData} />
          </TabsContent>
        )}

        {selectedUserAnalytics && (
          <TabsContent value="user" className="space-y-4">
            <UserAnalyticsView analytics={selectedUserAnalytics} timeSeriesData={timeSeriesData} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

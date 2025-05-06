"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserAnalytics } from "../types"
import { BarChart } from "./charts/bar-chart"
import { PieChart } from "./charts/pie-chart"
import { LineChart } from "./charts/line-chart"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserAnalyticsViewProps {
  analytics: UserAnalytics
  timeSeriesData?: any[]
}

export function UserAnalyticsView({ analytics, timeSeriesData }: UserAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Format category data for charts
  const categoryData = Object.entries(analytics.responsesByCategory).map(([category, count]) => ({
    category,
    count,
  }))

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(analytics.userName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{analytics.userName}</CardTitle>
            <CardDescription>User ID: {analytics.userId}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
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
                  <CardTitle className="text-lg">Forms Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.completedForms}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{Object.keys(analytics.responsesByCategory).length}</p>
                </CardContent>
              </Card>
            </div>

            {categoryData.length > 0 && (
              <BarChart
                data={categoryData}
                xKey="category"
                yKey="count"
                title="Responses by Category"
                description="Number of responses in each category"
                color="#8884d8"
                height={300}
              />
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {categoryData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PieChart
                  data={categoryData}
                  nameKey="category"
                  valueKey="count"
                  title="Category Distribution"
                  description="Proportion of responses in each category"
                  height={300}
                />
                <BarChart
                  data={categoryData}
                  xKey="category"
                  yKey="count"
                  title="Category Breakdown"
                  description="Number of responses in each category"
                  color="#8884d8"
                  height={300}
                />
              </div>
            ) : (
              <p>No category data available for this user.</p>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {timeSeriesData && timeSeriesData.length > 0 ? (
              <LineChart
                data={timeSeriesData}
                xKey="label"
                yKey="value"
                title="User Activity Over Time"
                description="Number of responses submitted over time"
                color="#82ca9d"
                height={400}
              />
            ) : (
              <p>No trend data available for this user.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { QuestionAnalytics } from "../types"
import { BarChart } from "./charts/bar-chart"
import { LineChart } from "./charts/line-chart"
import { PieChart } from "./charts/pie-chart"
import { WordCloud } from "./charts/word-cloud"
import { EmojiChart } from "./charts/emoji-chart"

interface QuestionAnalyticsViewProps {
  analytics: QuestionAnalytics
  timeSeriesData?: any[]
}

export function QuestionAnalyticsView({ analytics, timeSeriesData }: QuestionAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const renderAnalyticsContent = () => {
    switch (analytics.inputType) {
      case "text":
        return renderTextAnalytics()
      case "number":
      case "slider":
        return renderNumericAnalytics()
      case "emoji":
        return renderEmojiAnalytics()
      case "yesno":
        return renderYesNoAnalytics()
      case "multiple":
        return renderMultipleChoiceAnalytics()
      default:
        return <p>No analytics available for this question type.</p>
    }
  }

  const renderTextAnalytics = () => {
    const { wordFrequency, totalWords, averageLength } = analytics.responseData

    return (
      <div className="space-y-6">
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
              <CardTitle className="text-lg">Total Words</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalWords}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avg. Response Length</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{averageLength.toFixed(1)} chars</p>
            </CardContent>
          </Card>
        </div>

        {wordFrequency && wordFrequency.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WordCloud
              words={wordFrequency.map((w) => ({ text: w.word, value: w.count }))}
              title="Word Frequency"
              description="Most common words in responses"
              height={300}
            />
            <BarChart
              data={wordFrequency.slice(0, 10)}
              xKey="word"
              yKey="count"
              title="Top 10 Words"
              description="Most frequently used words"
              color="#8884d8"
            />
          </div>
        )}

        {timeSeriesData && timeSeriesData.length > 0 && (
          <LineChart
            data={timeSeriesData}
            xKey="label"
            yKey="value"
            title="Responses Over Time"
            description="Number of responses received over time"
            color="#82ca9d"
          />
        )}
      </div>
    )
  }

  const renderNumericAnalytics = () => {
    const { min, max, average, median, distribution } = analytics.responseData

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Minimum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{min}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Maximum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{max}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{average.toFixed(1)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Median</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{median}</p>
            </CardContent>
          </Card>
        </div>

        {distribution && distribution.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChart
              data={distribution}
              xKey="range"
              yKey="count"
              title="Value Distribution"
              description="Distribution of responses across value ranges"
              color="#8884d8"
            />
            <PieChart
              data={distribution}
              nameKey="range"
              valueKey="count"
              title="Distribution Breakdown"
              description="Proportion of responses in each range"
            />
          </div>
        )}

        {timeSeriesData && timeSeriesData.length > 0 && (
          <LineChart
            data={timeSeriesData}
            xKey="label"
            yKey="value"
            title="Responses Over Time"
            description="Number of responses received over time"
            color="#82ca9d"
          />
        )}
      </div>
    )
  }

  const renderEmojiAnalytics = () => {
    const { emojiCounts, totalResponses, averageValue } = analytics.responseData

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalResponses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Most Common</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{emojiCounts[0]?.emoji || "N/A"}</p>
            </CardContent>
          </Card>
          {averageValue !== undefined && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{averageValue.toFixed(1)}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {emojiCounts && emojiCounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmojiChart
              data={emojiCounts}
              title="Emoji Distribution"
              description="Frequency of each emoji response"
              showValues={averageValue !== undefined}
            />
            <PieChart
              data={emojiCounts.map((item) => ({ name: item.emoji, value: item.count }))}
              nameKey="name"
              valueKey="value"
              title="Emoji Breakdown"
              description="Proportion of each emoji response"
            />
          </div>
        )}

        {timeSeriesData && timeSeriesData.length > 0 && (
          <LineChart
            data={timeSeriesData}
            xKey="label"
            yKey="value"
            title="Responses Over Time"
            description="Number of responses received over time"
            color="#82ca9d"
          />
        )}
      </div>
    )
  }

  const renderYesNoAnalytics = () => {
    const { yes, no } = analytics.responseData
    const pieData = [
      { name: "Yes", value: yes },
      { name: "No", value: no },
    ]
    const barData = [
      { name: "Yes", value: yes },
      { name: "No", value: no },
    ]

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{yes + no}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Yes Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {yes} ({((yes / (yes + no)) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">No Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {no} ({((no / (yes + no)) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChart
            data={pieData}
            nameKey="name"
            valueKey="value"
            title="Yes/No Distribution"
            description="Proportion of Yes and No responses"
            colors={["#4CAF50", "#F44336"]}
          />
          <BarChart
            data={barData}
            xKey="name"
            yKey="value"
            title="Yes/No Comparison"
            description="Count of Yes and No responses"
            color="#8884d8"
          />
        </div>

        {timeSeriesData && timeSeriesData.length > 0 && (
          <LineChart
            data={timeSeriesData}
            xKey="label"
            yKey="value"
            title="Responses Over Time"
            description="Number of responses received over time"
            color="#82ca9d"
          />
        )}
      </div>
    )
  }

  const renderMultipleChoiceAnalytics = () => {
    const { options, totalSelections, totalResponses, averageSelectionsPerResponse } = analytics.responseData

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalResponses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Selections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalSelections}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avg. Selections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{averageSelectionsPerResponse.toFixed(1)}</p>
            </CardContent>
          </Card>
        </div>

        {options && options.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChart
              data={options}
              xKey="label"
              yKey="count"
              title="Option Selections"
              description="Number of times each option was selected"
              color="#8884d8"
            />
            <PieChart
              data={options.map((option) => ({ name: option.label, value: option.count }))}
              nameKey="name"
              valueKey="value"
              title="Option Distribution"
              description="Proportion of selections for each option"
            />
          </div>
        )}

        {timeSeriesData && timeSeriesData.length > 0 && (
          <LineChart
            data={timeSeriesData}
            xKey="label"
            yKey="value"
            title="Responses Over Time"
            description="Number of responses received over time"
            color="#82ca9d"
          />
        )}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{analytics.question}</CardTitle>
        <CardDescription>
          {analytics.category} • {analytics.inputType} • {analytics.totalResponses} responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {renderAnalyticsContent()}
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            {timeSeriesData && timeSeriesData.length > 0 ? (
              <LineChart
                data={timeSeriesData}
                xKey="label"
                yKey="value"
                title="Responses Over Time"
                description="Number of responses received over time"
                color="#82ca9d"
                height={400}
              />
            ) : (
              <p>No trend data available for this question.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

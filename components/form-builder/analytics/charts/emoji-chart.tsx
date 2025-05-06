"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EmojiChartProps {
  data: Array<{ emoji: string; count: number; percentage: number; value?: number }>
  title: string
  description?: string
  showValues?: boolean
}

export function EmojiChart({ data, title, description, showValues = true }: EmojiChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-medium">
                    {item.count} responses ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                {showValues && item.value !== undefined && (
                  <span className="text-sm text-muted-foreground">Value: {item.value}</span>
                )}
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

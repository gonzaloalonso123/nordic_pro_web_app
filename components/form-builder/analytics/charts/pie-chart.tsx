"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PieChartProps {
  data: Array<Record<string, any>>
  nameKey: string
  valueKey: string
  title: string
  description?: string
  colors?: string[]
  height?: number
  showLegend?: boolean
}

export function PieChart({
  data,
  nameKey,
  valueKey,
  title,
  description,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"],
  height = 300,
  showLegend = true,
}: PieChartProps) {
  // Ensure we have enough colors
  const extendedColors = Array.from({ length: data.length }, (_, i) => colors[i % colors.length])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey={valueKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={extendedColors[index % extendedColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}`} />
              {showLegend && <Legend />}
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

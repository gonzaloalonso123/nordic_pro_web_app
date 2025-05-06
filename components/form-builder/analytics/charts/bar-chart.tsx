"use client"

import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface BarChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  title: string
  description?: string
  color?: string
  xLabel?: string
  yLabel?: string
  dataKey?: string
  height?: number
  showLegend?: boolean
}

export function BarChart({
  data,
  xKey,
  yKey,
  title,
  description,
  color = "#8884d8",
  xLabel,
  yLabel,
  dataKey,
  height = 300,
  showLegend = false,
}: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div ref={chartRef} style={{ width: "100%", height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                label={xLabel ? { value: xLabel, position: "insideBottom", offset: -5 } : undefined}
              />
              <YAxis label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined} />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey={yKey} name={dataKey || yKey} fill={color} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

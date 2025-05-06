"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface LineChartProps {
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

export function LineChart({
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
}: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
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
              <Line type="monotone" dataKey={yKey} name={dataKey || yKey} stroke={color} activeDot={{ r: 8 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

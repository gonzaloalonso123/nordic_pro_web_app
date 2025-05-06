"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as d3 from "d3"

interface HeatmapProps {
  data: Array<{ x: string; y: string; value: number }>
  title: string
  description?: string
  xLabel?: string
  yLabel?: string
  height?: number
  colorRange?: [string, string]
}

export function Heatmap({
  data,
  title,
  description,
  xLabel,
  yLabel,
  height = 300,
  colorRange = ["#f7fbff", "#08306b"],
}: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 30, right: 30, bottom: 50, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Get unique x and y values
    const xValues = Array.from(new Set(data.map((d) => d.x)))
    const yValues = Array.from(new Set(data.map((d) => d.y)))

    // Create scales
    const xScale = d3.scaleBand().domain(xValues).range([0, innerWidth]).padding(0.05)

    const yScale = d3.scaleBand().domain(yValues).range([innerHeight, 0]).padding(0.05)

    // Color scale
    const valueExtent = d3.extent(data, (d) => d.value) as [number, number]
    const colorScale = d3
      .scaleSequential()
      .domain(valueExtent)
      .interpolator(d3.interpolate(colorRange[0], colorRange[1]))

    // Create the main group
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add rectangles
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.x) || 0)
      .attr("y", (d) => yScale(d.y) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.value))
      .append("title")
      .text((d) => `${d.x}, ${d.y}: ${d.value}`)

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")

    // Add y-axis
    g.append("g").call(d3.axisLeft(yScale))

    // Add x-axis label
    if (xLabel) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text(xLabel)
    }

    // Add y-axis label
    if (yLabel) {
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 15)
        .style("text-anchor", "middle")
        .text(yLabel)
    }
  }, [data, xLabel, yLabel, colorRange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: `${height}px` }}>
          <svg ref={svgRef} width="100%" height="100%" />
        </div>
      </CardContent>
    </Card>
  )
}

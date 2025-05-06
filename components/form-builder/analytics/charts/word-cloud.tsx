"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as d3 from "d3"
import cloud from "d3-cloud"

interface WordCloudProps {
  words: Array<{ text: string; value: number }>
  title: string
  description?: string
  height?: number
  colors?: string[]
}

export function WordCloud({
  words,
  title,
  description,
  height = 300,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"],
}: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Set up the layout
    const layout = cloud()
      .size([width, height])
      .words(words.map((d) => ({ text: d.text, size: 10 + d.value * 5 }))) // Scale size based on value
      .padding(5)
      .rotate(() => 0) // No rotation for better readability
      .font("Arial")
      .fontSize((d) => (d as any).size)
      .on("end", draw)

    layout.start()

    // Draw the word cloud
    function draw(words: any[]) {
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Arial")
        .style("fill", (_, i) => colors[i % colors.length])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .text((d) => d.text)
    }
  }, [words, colors])

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

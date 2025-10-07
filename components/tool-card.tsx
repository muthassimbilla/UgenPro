"use client"

import type { Tool } from "@/lib/tools-config"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  tool: Tool
  onClick: () => void
  featured?: boolean
}

export function ToolCard({ tool, onClick, featured = false }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "tool_card_click", {
        tool_id: tool.id,
        tool_name: tool.name,
      })
    }
    onClick()
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-500",
        "border-2 border-border/50 rounded-3xl bg-card/50 backdrop-blur-xl",
        "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-[1.02]",
        featured ? "md:row-span-1" : "",
        "h-full",
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-[#2B7FFF]/10 via-[#4a9fff]/10 to-[#2B7FFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        )}
      />

      <div className={cn("p-8 space-y-6 h-full flex flex-col relative z-10", featured && "md:p-10")}>
        <div className="flex items-center justify-start">
          <div
            className={cn(
              "p-4 rounded-2xl bg-gradient-to-br from-[#2B7FFF]/20 via-[#4a9fff]/20 to-[#2B7FFF]/20 border-2 border-[#2B7FFF]/30 group-hover:border-[#2B7FFF]/50 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#2B7FFF]/30",
              featured && "p-5",
            )}
          >
            <tool.icon className={cn("text-[#2B7FFF] dark:text-[#2B7FFF]", featured ? "h-8 w-8" : "h-6 w-6")} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 flex-1">
          <h3
            className={cn(
              "font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#2B7FFF] group-hover:via-[#4a9fff] group-hover:to-[#2B7FFF] group-hover:bg-clip-text group-hover:text-transparent",
              featured ? "text-3xl" : "text-2xl",
            )}
          >
            {tool.name}
          </h3>
          <p className={cn("text-muted-foreground leading-relaxed", featured ? "text-lg" : "text-base")}>
            {tool.description}
          </p>

          {/* Features List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold bg-gradient-to-r from-[#2B7FFF] to-[#4a9fff] bg-clip-text text-transparent">
              Key Features:
            </h4>
            <ul className="space-y-1.5">
              {tool.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#2B7FFF] to-[#4a9fff] mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {tool.features.length > 3 && (
                <li className="text-xs font-medium bg-gradient-to-r from-[#2B7FFF] to-[#4a9fff] bg-clip-text text-transparent">
                  +{tool.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center pt-4">
          <div className="px-6 py-2.5 bg-gradient-to-r from-[#2B7FFF]/20 via-[#4a9fff]/20 to-[#2B7FFF]/20 border-2 border-[#2B7FFF]/30 rounded-xl text-sm font-bold text-[#2B7FFF] dark:text-[#2B7FFF] hover:text-[#4a9fff] dark:hover:text-[#4a9fff] hover:border-[#2B7FFF]/50 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl group-hover:shadow-[#2B7FFF]/30">
            Try Demo
          </div>
        </div>
      </div>
    </Card>
  )
}

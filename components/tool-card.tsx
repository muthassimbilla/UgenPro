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
        "border-2 border-gradient-to-r from-[#2B7FFF]/50 via-[#4a9fff]/50 to-[#2B7FFF]/50 dark:from-[#2B7FFF]/60 dark:via-[#4a9fff]/60 dark:to-[#2B7FFF]/60 rounded-3xl bg-gradient-to-br from-white/98 via-blue-50/95 to-white/98 dark:from-gray-900/98 dark:via-blue-950/95 dark:to-gray-900/98 shadow-2xl",
        "hover:border-[#2B7FFF]/80 hover:shadow-2xl hover:shadow-[#2B7FFF]/30 hover:-translate-y-4 hover:scale-[1.03]",
        featured ? "md:row-span-1 ring-2 ring-[#2B7FFF]/30" : "",
        "h-full backdrop-blur-sm",
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-[#2B7FFF]/15 via-[#4a9fff]/15 to-[#2B7FFF]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        )}
      />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#2B7FFF]/20 via-[#4a9fff]/20 to-[#2B7FFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div className={cn("p-8 space-y-6 h-full flex flex-col relative z-10", featured && "md:p-10")}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3e93ff] to-[#2d7ce8] rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center justify-start">
          <div
            className={cn(
              "p-4 rounded-2xl bg-gradient-to-br from-[#2B7FFF]/25 via-[#4a9fff]/25 to-[#2B7FFF]/25 border-2 border-[#2B7FFF]/40 group-hover:border-[#2B7FFF]/60 group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#2B7FFF]/40 backdrop-blur-sm",
              featured && "p-5 ring-2 ring-[#2B7FFF]/20",
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
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#3e93ff]">
              ✨ Key Features:
            </h4>
            <ul className="space-y-2">
              {tool.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#3e93ff] mt-1.5 flex-shrink-0 shadow-sm" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {tool.features.length > 3 && (
                <li className="text-xs font-medium text-[#3e93ff] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3e93ff]" />
                  +{tool.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center pt-4">
          <div className="px-10 py-4 bg-gradient-to-r from-[#3e93ff] to-[#2d7ce8] hover:from-[#2d7ce8] hover:to-[#1a6bff] border-2 border-[#3e93ff]/60 hover:border-[#3e93ff]/90 rounded-2xl text-base font-bold text-white hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-3xl hover:shadow-[#3e93ff]/40 backdrop-blur-sm relative overflow-hidden group">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="flex items-center gap-3 relative z-10">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Open Tool
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

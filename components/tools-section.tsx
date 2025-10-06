"use client"

import { toolsData } from "@/lib/tools-config"
import { ToolCard } from "@/components/tool-card"
import { useState, lazy, Suspense, useMemo } from "react"
import type { Tool } from "@/lib/tools-config"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"
import { Layers } from "lucide-react"

const LazyToolModal = lazy(() =>
  import("@/components/tool-modal").then((mod) => ({
    default: mod.ToolModal,
  })),
)

export function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedTool(null), 300)
  }

  const firstThreeTools = useMemo(() => toolsData.slice(0, 3), [])
  const remainingTools = useMemo(() => toolsData.slice(3), [])

  return (
    <section id="tools" ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-50/30 via-blue-50/20 to-background dark:via-blue-950/10 dark:via-blue-950/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#2B7FFF]/10 via-[#4a9fff]/10 to-[#2B7FFF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#4a9fff]/8 via-[#2B7FFF]/8 to-[#4a9fff]/8 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="max-w-4xl mb-12 text-center mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow border-2 border-[#2B7FFF]/60 hover:border-[#2B7FFF] text-sm font-bold mb-6 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-900/30">
            <Layers className="h-4 w-4 text-[#2B7FFF] dark:text-[#2B7FFF]" />
            <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent font-bold">
              Powerful Tools
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
            <span className="text-shadow-lg">Everything you need to</span>{" "}
            <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent text-shadow-lg">
              build faster
            </span>
          </h2>
        </motion.div>

        {/* All tools in same size - 3 cards in one row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {firstThreeTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional tools if more than 3 */}
        {remainingTools.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {remainingTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Suspense fallback={null}>
        <LazyToolModal tool={selectedTool} isOpen={isModalOpen} onClose={handleCloseModal} />
      </Suspense>
    </section>
  )
}

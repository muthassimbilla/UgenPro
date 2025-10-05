"use client"

import { toolsData } from "@/lib/tools-config"
import { ToolCard } from "@/components/tool-card"
import { useState, lazy, Suspense, useMemo } from "react"
import type { Tool } from "@/lib/tools-config"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"

// Optimized lazy loading with preload
const LazyToolModal = lazy(() => 
  import("@/components/tool-modal").then((mod) => ({ 
    default: mod.ToolModal 
  }))
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

  // Memoized tools data for better performance
  const featuredTools = useMemo(() => toolsData.slice(0, 2), [])
  const regularTools = useMemo(() => toolsData.slice(2), [])
  const firstThreeTools = useMemo(() => toolsData.slice(0, 3), [])
  const remainingTools = useMemo(() => toolsData.slice(3), [])

  return (
    <section id="tools" ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="max-w-4xl mb-8 text-center mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow border-2 border-primary/60 hover:border-primary text-sm font-bold mb-6 transition-all duration-300 hover:scale-105">
            <span className="gradient-text">Powerful Tools</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
            Everything you need to build faster
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

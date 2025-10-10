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
  })).catch((error) => {
    console.error('Failed to load ToolModal:', error)
    return { default: () => <div>Failed to load modal</div> }
  }),
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
    <section id="tools" ref={sectionRef} className="relative py-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-50/30 via-blue-50/20 to-background dark:via-blue-950/10 dark:via-blue-950/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#2B7FFF]/10 via-[#4a9fff]/10 to-[#2B7FFF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#4a9fff]/8 via-[#2B7FFF]/8 to-[#4a9fff]/8 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          className="max-w-4xl mb-4 text-center mx-auto px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
            <span className="text-shadow-lg">Our Tools</span>
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance font-medium mt-4">
            Professional generator tools for CPA self signup, user agent generation,<br />
            address generation, and email2name conversion. Fast, secure, and reliable online tools.
          </p>
        </motion.div>

        {/* All tools in same size - 3 cards in one row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto"
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

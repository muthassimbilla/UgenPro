"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { memo, useCallback, useMemo } from "react"
import { FlippingText } from "./flipping-text"
import { TextGenerateEffect } from "./text-generate-effect"
import { PerformanceOptimizer, useReducedMotion } from "./performance-optimizer"
import { OptimizedImage, preloadImage } from "./optimized-image"

export const HeroSection = memo(function HeroSection() {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const handleGetStarted = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: "hero_get_started",
      })
    }
    router.push("/signup")
  }, [router])

  // Memoize animation variants for better performance
  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      },
    },
  }), [])

  return (
    <section id="hero" className="relative min-h-[80vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden pt-12 pb-4 sm:pt-16 sm:pb-6">


      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <PerformanceOptimizer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.8 }}
              className="space-y-4 sm:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full glass shadow-glow text-xs sm:text-sm font-semibold hover-lift border-2 border-[#2B7FFF]/60 hover:border-[#2B7FFF] transition-all duration-300 bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-900/30"
              >
                <Sparkles className="h-4 w-4 text-[#2B7FFF] dark:text-[#2B7FFF] animate-pulse" />
                <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent font-bold">
                  Next-Gen AI Tools
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden sm:block"
              >
                <FlippingText text="Premium Tools For" words={["CPA Marketing", "CPA Self Sign-Up"]} duration={2500} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block sm:hidden"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  <span className="text-shadow-lg">Premium Tools For</span>{" "}
                  <span className="gradient-text-rainbow text-shadow-lg">CPA Marketing</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-sm sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance font-medium px-2 sm:px-0"
              >
                Supercharge your CPA marketing with AI-powered tools. Leads, content, and automation in seconds	—with our
                <span className="text-[#2B7FFF] dark:text-[#2B7FFF] font-semibold"> premium toolkit</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center px-2 sm:px-0"
              >
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-6 bg-[#2B7FFF] hover:bg-[#1a6bff] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all group interactive-scale w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-6 glass hover:glass-strong border-2 border-emerald-300/50 hover:border-emerald-500/60 dark:border-emerald-700/50 dark:hover:border-emerald-500/60 rounded-xl font-bold interactive-scale"
                >
                  Explore Tools
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4 sm:gap-8 justify-center"
              >
                <div className="flex items-center gap-3 hover-lift">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#2B7FFF]/20 to-[#4a9fff]/20 shadow-glow">
                    <Zap className="h-5 w-5 text-[#2B7FFF] dark:text-[#2B7FFF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#2B7FFF] to-[#4a9fff] bg-clip-text text-transparent">
                      10x
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Faster</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 hover-lift">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#4a9fff]/20 to-[#2B7FFF]/20 shadow-glow">
                    <TrendingUp className="h-5 w-5 text-[#4a9fff] dark:text-[#4a9fff]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent">
                      10K+
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Users</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </PerformanceOptimizer>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 sm:mt-16 text-center"
        >
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground">
            Join thousands of developers building the future with AI-powered tools
          </p>
        </motion.div>
      </div>
    </section>
  )
})

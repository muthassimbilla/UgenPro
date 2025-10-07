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
    <section id="hero" className="relative min-h-[90vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden pt-16 pb-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 dark:from-blue-950/20 dark:via-blue-950/20 dark:to-blue-950/20 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-blue-100/30 to-blue-100/50 dark:from-blue-900/10 dark:via-blue-900/10 dark:to-blue-900/10 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(43,127,255,0.15),transparent_40%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(43,127,255,0.15),transparent_50%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(43,127,255,0.12),transparent_50%)] -z-10" />

      {!prefersReducedMotion && (
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#2B7FFF]/20 via-[#4a9fff]/20 to-[#2B7FFF]/20 rounded-full blur-3xl opacity-60"
            style={{ animation: "float 8s ease-in-out infinite" }}
          />
          <div
            className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-[#4a9fff]/25 via-[#2B7FFF]/20 to-[#4a9fff]/15 rounded-full blur-3xl opacity-50"
            style={{ animation: "float 10s ease-in-out infinite reverse" }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-[#2B7FFF]/20 via-[#4a9fff]/15 to-[#2B7FFF]/20 rounded-full blur-2xl opacity-40"
            style={{ animation: "float 12s ease-in-out infinite" }}
          />
        </div>
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background/20 via-transparent to-background/10" />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <PerformanceOptimizer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.8 }}
              className="space-y-6 sm:space-y-8"
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
              >
                <FlippingText text="Premium Tools For" words={["CPA Marketing", "CPA Self Sign-Up"]} duration={2500} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance font-medium px-4 sm:px-0"
              >
                Unlock the power of AI-driven development. Generate code, content, and designs in seconds with our
                <span className="text-[#2B7FFF] dark:text-[#2B7FFF] font-semibold"> professional toolkit</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
              >
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 bg-[#2B7FFF] hover:bg-[#1a6bff] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all group interactive-scale w-full sm:w-auto"
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
                  className="text-base px-8 py-6 glass hover:glass-strong border-2 border-emerald-300/50 hover:border-emerald-500/60 dark:border-emerald-700/50 dark:hover:border-emerald-500/60 rounded-xl font-bold interactive-scale"
                >
                  Explore Tools
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-8 justify-center"
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
          className="mt-16 text-center"
        >
          <p className="text-lg md:text-xl text-muted-foreground">
            Join thousands of developers building the future with AI-powered tools
          </p>
        </motion.div>
      </div>
    </section>
  )
})

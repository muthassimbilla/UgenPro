"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FlippingText } from "./flipping-text"
import { TextGenerateEffect } from "./text-generate-effect"
import { PerformanceOptimizer, useReducedMotion } from "./performance-optimizer"

export function HeroSection() {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const handleGetStarted = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: "hero_get_started",
      })
    }
    router.push("/signup")
  }

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced background with beautiful gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/6 via-tertiary/4 to-background -z-10" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.15),transparent_40%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.12),transparent_50%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,hsl(var(--tertiary)/0.08),transparent_50%)] -z-10" />
      
      {/* Optimized animated floating orbs - reduced animation intensity */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl opacity-30" 
               style={{ animation: 'float 8s ease-in-out infinite' }} />
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent/8 to-tertiary/8 rounded-full blur-2xl opacity-25" 
               style={{ animation: 'float 10s ease-in-out infinite reverse' }} />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-tertiary/10 to-primary/10 rounded-full blur-xl opacity-20" 
               style={{ animation: 'float 12s ease-in-out infinite' }} />
        </div>
      )}
      
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background/20 via-transparent to-background/10" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Centered Content */}
          <PerformanceOptimizer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.8 }}
              className="space-y-8"
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow text-sm font-semibold hover-lift border-2 border-primary/60 hover:border-primary transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="gradient-text font-bold">
                Next-Gen AI Tools
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FlippingText 
                text="Premium Tools For" 
                words={["CPA Marketing", "CPA Self Sign-Up"]}
                duration={2500}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance font-medium"
            >
              Unlock the power of AI-driven development. Generate code, content, and designs in seconds with our 
              <span className="text-primary font-semibold"> professional toolkit</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="text-base px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl font-bold shadow-color hover:shadow-glow-accent transition-all group interactive-scale"
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
                className="text-base px-8 py-6 glass hover:glass-strong border-2 border-primary/30 hover:border-primary/60 rounded-xl font-bold interactive-scale"
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
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-glow">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">10x</div>
                  <div className="text-sm text-muted-foreground font-medium">Faster</div>
                </div>
              </div>
              <div className="flex items-center gap-3 hover-lift">
                <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-glow-accent">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">10K+</div>
                  <div className="text-sm text-muted-foreground font-medium">Users</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          </PerformanceOptimizer>
        </div>

        {/* Animated text section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <TextGenerateEffect 
            words="Join thousands of developers building the future with AI-powered tools"
            className="text-lg md:text-xl text-muted-foreground"
            duration={0.8}
            repeatInterval={0}
          />
        </motion.div>
      </div>
    </section>
  )
}

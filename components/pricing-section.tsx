"use client"

import { PricingCards } from "@/components/pricing-cards"
import { useRouter } from "next/navigation"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"

export function PricingSection() {
  const router = useRouter()
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  const handleSelectPlan = (planId: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "select_plan", {
        event_category: "pricing",
        event_label: planId,
      })
    }
    router.push("/signup")
  }

  return (
    <section id="pricing" ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-50/30 via-blue-50/20 to-background dark:via-blue-950/10 dark:via-blue-950/10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-[#2B7FFF]/10 via-[#4a9fff]/10 to-[#2B7FFF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-[#4a9fff]/8 via-[#2B7FFF]/8 to-[#4a9fff]/8 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow border-2 border-[#2B7FFF]/60 hover:border-[#2B7FFF] text-sm font-bold mb-6 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-900/30">
            <DollarSign className="h-4 w-4 text-[#2B7FFF] dark:text-[#2B7FFF]" />
            <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent font-bold">
              Pricing Plans
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance">
            <span className="text-shadow-lg">Simple,</span>{" "}
            <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent text-shadow-lg">
              transparent pricing
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-balance max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Premium tools for professional results.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PricingCards onSelectPlan={handleSelectPlan} buttonText="Get Started" />
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection

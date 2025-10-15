"use client"

import { useRouter } from "next/navigation"
import { pricingPlans } from "@/lib/pricing-data"
import { useState } from "react"
import EnhancedPurchaseModal from "@/components/enhanced-purchase-modal"

export function PricingSection() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string
    name: string
    price: string
    duration: string
  } | null>(null)

  const handleSelectPlan = (planId: string) => {
    const plan = pricingPlans.find((p) => p.id === planId)
    if (plan) {
      setSelectedPlan({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
      })
      setIsModalOpen(true)
    }
  }

  return (
    <section id="pricing" className="relative py-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-50/20 to-background dark:via-blue-950/5" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-4 px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full glass shadow-md border border-[#2B7FFF]/40 hover:border-[#2B7FFF]/60 text-xs sm:text-sm font-bold mb-2 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-blue-50/60 to-blue-50/60 dark:from-blue-900/20 dark:to-blue-900/20">
            <span className="text-2xl">💰</span>
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
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4 sm:px-0">
            {pricingPlans.map((plan) => (
              <div key={plan.id} className="group h-full">
                <div
                  className={`h-full rounded-3xl bg-gradient-to-br from-white/95 via-blue-50/80 to-white/95 dark:from-gray-900/95 dark:via-blue-950/80 dark:to-gray-900/95 shadow-lg transition-all duration-300 overflow-hidden flex flex-col relative ${
                    plan.is_popular
                      ? "ring-1 ring-primary shadow-xl shadow-primary/20 scale-[1.02]"
                      : "hover:shadow-xl hover:shadow-[#2B7FFF]/15 hover:-translate-y-2"
                  }`}
                  style={{ willChange: "transform", transform: "translateZ(0)" }}
                >
                  {plan.is_popular && (
                    <div className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] text-white text-center py-2.5 text-sm font-bold shadow-lg">
                      ⭐ Most Popular
                    </div>
                  )}

                  <div className={`p-8 flex-shrink-0 relative z-10 ${plan.is_popular ? "" : "pt-12"}`}>
                    <div className="space-y-4">
                      <h3
                        className={`text-2xl font-bold ${plan.is_popular ? "bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent" : ""}`}
                      >
                        {plan.name}
                      </h3>

                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground font-medium">/ {plan.duration}</span>
                      </div>

                      {plan.original_price && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground line-through">{plan.original_price}</span>
                          <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 font-bold shadow-sm px-2 py-1 rounded text-xs">
                            {plan.discount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex flex-col flex-1 relative z-10">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-xs">✓</span>
                          </div>
                          <span className="text-sm leading-relaxed text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6 flex-shrink-0">
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer relative overflow-hidden ${
                          plan.is_popular
                            ? "bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF]"
                            : "bg-[#2B7FFF]"
                        }`}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedPlan && (
        <EnhancedPurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          planDuration={selectedPlan.duration}
        />
      )}
    </section>
  )
}

export default PricingSection

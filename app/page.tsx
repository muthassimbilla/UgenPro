"use client"

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"

const LoadingSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-muted/10 rounded-lg`} />
)

const ToolsSection = dynamic(
  () => import("@/components/tools-section").then((mod) => ({ default: mod.ToolsSection })),
  {
    loading: () => <LoadingSkeleton height="h-[400px] sm:h-[600px]" />,
    ssr: false,
  },
)

const PricingSection = dynamic(
  () => import("@/components/pricing-section").then((mod) => ({ default: mod.PricingSection })),
  {
    loading: () => <LoadingSkeleton height="h-[300px] sm:h-[500px]" />,
    ssr: false,
  },
)

const ContactSection = dynamic(
  () => import("@/components/contact-section").then((mod) => ({ default: mod.ContactSection })),
  {
    loading: () => <LoadingSkeleton height="h-[250px] sm:h-[400px]" />,
    ssr: false,
  },
)

const Footer = dynamic(() => import("@/components/footer").then((mod) => ({ default: mod.Footer })), {
  loading: () => <LoadingSkeleton height="h-32 sm:h-64" />,
  ssr: false,
})

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero")

  const sections = useMemo(() => ["hero", "tools", "pricing", "contact"], [])

  const handleSmoothScroll = useCallback((e: Event) => {
    const target = e.target as HTMLAnchorElement
    if (target.hash) {
      e.preventDefault()

      const targetElement = document.querySelector(target.hash)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "auto",
          block: "start",
        })
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.id
            if (sections.includes(sectionId)) {
              setActiveSection(sectionId)
            }
          }
        })
      },
      {
        threshold: [0.3],
        rootMargin: "-80px 0px -30% 0px",
      },
    )

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    document.addEventListener("click", handleSmoothScroll, { passive: false })

    return () => {
      observer.disconnect()
      document.removeEventListener("click", handleSmoothScroll)
    }
  }, [sections, handleSmoothScroll])

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} />

      <main className="relative z-10">
        <HeroSection />
        <div>
          <ToolsSection />
          <PricingSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}

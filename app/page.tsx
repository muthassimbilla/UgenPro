"use client"

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"
// import { PerformanceMonitor } from "@/components/performance-monitor"

const LoadingSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-muted/10 rounded-lg`} />
)

// Lazy load heavy components with optimized loading states and better error handling
const ToolsSection = dynamic(
  () => {
    return import("@/components/tools-section")
      .then((mod) => ({ default: mod.ToolsSection }))
      .catch((error) => {
        console.error("Failed to load ToolsSection:", error)
        return {
          default: () => (
            <div className="h-[400px] sm:h-[600px] flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">Failed to load tools section</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ),
        }
      })
  },
  {
    loading: () => <LoadingSkeleton height="h-[400px] sm:h-[600px]" />,
    ssr: true, // Enabled SSR
  },
)

const PricingSection = dynamic(
  () => {
    return import("@/components/pricing-section")
      .then((mod) => ({ default: mod.PricingSection }))
      .catch((error) => {
        console.error("Failed to load PricingSection:", error)
        return {
          default: () => (
            <div className="h-[300px] sm:h-[500px] flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">Failed to load pricing section</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ),
        }
      })
  },
  {
    loading: () => <LoadingSkeleton height="h-[300px] sm:h-[500px]" />,
    ssr: true, // Enabled SSR
  },
)

const ContactSection = dynamic(
  () => {
    return import("@/components/contact-section")
      .then((mod) => ({ default: mod.ContactSection }))
      .catch((error) => {
        console.error("Failed to load ContactSection:", error)
        return {
          default: () => (
            <div className="h-[250px] sm:h-[400px] flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">Failed to load contact section</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ),
        }
      })
  },
  {
    loading: () => <LoadingSkeleton height="h-[250px] sm:h-[400px]" />,
    ssr: true, // Enabled SSR
  },
)

const Footer = dynamic(
  () => {
    return import("@/components/footer")
      .then((mod) => ({ default: mod.Footer }))
      .catch((error) => {
        console.error("Failed to load Footer:", error)
        return {
          default: () => (
            <div className="h-32 sm:h-64 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">Failed to load footer</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ),
        }
      })
  },
  {
    loading: () => <LoadingSkeleton height="h-32 sm:h-64" />,
    ssr: true, // Enabled SSR
  },
)

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero")

  // Performance monitoring
  // const { metrics, score, grade } = PerformanceMonitor({
  //   enableLogging: process.env.NODE_ENV === 'development'
  // })

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
        threshold: [0.3], // Single threshold for better performance
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <Navigation activeSection={activeSection} />

      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/30 to-pink-100/50 dark:hidden" />
        <div className="hidden dark:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/25 via-purple-900/15 to-pink-900/25" />
        </div>
        <div
          className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-400/30 dark:bg-blue-500/15 rounded-full opacity-60"
          style={{ willChange: "opacity" }}
        />
        <div
          className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-400/30 dark:bg-purple-500/15 rounded-full opacity-60"
          style={{ willChange: "opacity" }}
        />
      </div>

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

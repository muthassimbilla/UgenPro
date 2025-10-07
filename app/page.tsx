"use client"

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"
// import { PerformanceMonitor } from "@/components/performance-monitor"

// Optimized loading skeleton
const LoadingSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-gradient-to-r from-muted/5 to-muted/10 animate-pulse rounded-lg`} />
)

// Lazy load heavy components with optimized loading states
const ToolsSection = dynamic(() => import("@/components/tools-section").then(mod => ({ default: mod.ToolsSection })), {
  loading: () => <LoadingSkeleton height="h-[600px]" />,
  ssr: false,
})

const PricingSection = dynamic(
  () => import("@/components/pricing-section").then((mod) => ({ default: mod.PricingSection })),
  {
    loading: () => <LoadingSkeleton height="h-[500px]" />,
    ssr: false,
  },
)

const ContactSection = dynamic(
  () => import("@/components/contact-section").then((mod) => ({ default: mod.ContactSection })),
  {
    loading: () => <LoadingSkeleton height="h-[400px]" />,
    ssr: false,
  },
)

const Footer = dynamic(() => import("@/components/footer").then((mod) => ({ default: mod.Footer })), {
  loading: () => <LoadingSkeleton height="h-64" />,
  ssr: false,
})

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero")
  
  // Performance monitoring
  // const { metrics, score, grade } = PerformanceMonitor({ 
  //   enableLogging: process.env.NODE_ENV === 'development' 
  // })

  // Optimized smooth scroll behavior
  useEffect(() => {
    // Set smooth scrolling only if user prefers it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "smooth"
    }
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  // Memoized sections array for better performance
  const sections = useMemo(() => ["hero", "tools", "pricing", "contact"], [])

  // Optimized smooth scroll handler - moved outside useEffect
  const handleSmoothScroll = useCallback((e: Event) => {
    const target = e.target as HTMLAnchorElement
    if (target.hash) {
      e.preventDefault()
      
      const targetElement = document.querySelector(target.hash)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }, [])

  // Optimized section tracking with throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let isScrolling = false
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return
        
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
              const sectionId = entry.target.id
              if (sections.includes(sectionId)) {
                setActiveSection(sectionId)
              }
            }
          })
        }, 100) // Optimized debounce time
      },
      {
        threshold: [0.2, 0.5], // Reduced thresholds for better performance
        rootMargin: "-100px 0px -30% 0px", // Optimized margins
      }
    )

    // Observe sections with error handling
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    // Add smooth scroll listeners
    document.addEventListener('click', handleSmoothScroll, { passive: false })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
      document.removeEventListener('click', handleSmoothScroll)
    }
  }, [sections, handleSmoothScroll])

  return (
    <div className="min-h-screen marble-bg">
      <Navigation activeSection={activeSection} />
      <main className="relative">
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

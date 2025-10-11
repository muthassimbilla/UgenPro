"use client"

import Link from "next/link"
import { ArrowUp, MessageCircle, Youtube, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-[#2B7FFF]/5 via-[#4a9fff]/3 to-[#2B7FFF]/5 dark:from-[#2B7FFF]/10 dark:via-[#4a9fff]/5 dark:to-[#2B7FFF]/10 border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B7FFF]/5 via-[#4a9fff]/5 to-[#2B7FFF]/5" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#2B7FFF]/10 via-[#4a9fff]/5 to-transparent blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#2B7FFF]/10 via-[#4a9fff]/5 to-transparent blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#4a9fff]/5 to-transparent blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-4">
          {/* Company Info Card */}
          <div className="bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-gray-900/95 dark:via-blue-950/90 dark:to-gray-900/95 rounded-3xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-[#2B7FFF]/25 transition-all duration-500 hover:-translate-y-3 border-2 border-[#2B7FFF]/40 dark:border-[#2B7FFF]/50 shadow-xl hover:border-[#2B7FFF]/60">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] p-0.5 transition-all duration-300 group-hover:scale-110 shadow-glow">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                  <img src="/ugenpro-logo.svg" alt="UGen Pro Logo" className="w-10 h-10 rounded-xl" />
                </div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] dark:from-[#2B7FFF] dark:via-[#4a9fff] dark:to-[#2B7FFF] bg-clip-text text-transparent">
                UGen Pro
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Professional AI-powered tools for developers and teams. Fast, reliable, and built for scale.
            </p>

            <div className="flex gap-4">
              <a
                href="https://t.me/+DS9l9qeSDfgxODI9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B7FFF]/20 to-[#2B7FFF]/10 hover:from-[#2B7FFF]/30 hover:to-[#2B7FFF]/20 border-2 border-[#2B7FFF]/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl group hover:shadow-[#2B7FFF]/25"
              >
                <MessageCircle className="w-6 h-6 text-[#2B7FFF] group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://youtube.com/@UGenPro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/10 hover:from-red-500/30 hover:to-red-500/20 border-2 border-red-500/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl group hover:shadow-red-500/25"
              >
                <Youtube className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-gradient-to-br from-white/95 via-emerald-50/90 to-white/95 dark:from-gray-900/95 dark:via-emerald-950/90 dark:to-gray-900/95 rounded-3xl p-6 hover:shadow-2xl hover:shadow-[#2B7FFF]/25 transition-all duration-500 hover:-translate-y-3 border-2 border-[#2B7FFF]/40 dark:border-[#2B7FFF]/50 shadow-xl hover:border-[#2B7FFF]/60">
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-[#2B7FFF] transition-all font-medium block py-2 px-3 rounded-xl hover:bg-[#2B7FFF]/10 hover:text-[#2B7FFF] group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#2B7FFF]" />
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("tools")}
                  className="w-full text-left text-sm text-muted-foreground hover:text-teal-500 transition-all font-medium block py-2 px-3 rounded-xl hover:bg-teal-500/10 hover:text-teal-500 group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                    Tools
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="w-full text-left text-sm text-muted-foreground hover:text-cyan-500 transition-all font-medium block py-2 px-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-500 group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                    Pricing
                  </span>
                </button>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-[#2B7FFF] transition-all font-medium block py-2 px-3 rounded-xl hover:bg-[#2B7FFF]/10 hover:text-[#2B7FFF] group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#2B7FFF]" />
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-white/95 via-purple-50/90 to-white/95 dark:from-gray-900/95 dark:via-purple-950/90 dark:to-gray-900/95 rounded-3xl p-6 hover:shadow-2xl hover:shadow-[#4a9fff]/25 transition-all duration-500 hover:-translate-y-3 border-2 border-[#4a9fff]/40 dark:border-[#4a9fff]/50 shadow-xl hover:border-[#4a9fff]/60">
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-[#4a9fff] via-[#2B7FFF] to-[#4a9fff] bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/+DS9l9qeSDfgxODI9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-cyan-500 transition-all font-medium block py-2 px-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-500 group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                    Community
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/ugenpro_admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-[#2B7FFF] transition-all font-medium block py-2 px-3 rounded-xl hover:bg-[#2B7FFF]/10 hover:text-[#2B7FFF] group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#2B7FFF]" />
                    Admin
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 max-w-6xl mx-auto border border-emerald-200/20 dark:border-emerald-500/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                UGen Pro
              </span>
              . All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="hover:text-foreground transition-colors hover:text-[#2B7FFF] dark:hover:text-[#2B7FFF]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-foreground transition-colors hover:text-[#4a9fff] dark:hover:text-[#4a9fff]"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] hover:from-[#1a6bff] hover:via-[#3a8fef] hover:to-[#1a6bff] text-white shadow-glow hover:shadow-glow-accent interactive-scale group border-2 border-white/20"
        >
          <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
        </Button>
      )}
    </footer>
  )
}

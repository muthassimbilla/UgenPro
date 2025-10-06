"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import AuthThemeToggle from "@/components/auth-theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  variant?: "login" | "signup"
}

export default function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Enhanced top navigation */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20">
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/15 to-white/5 dark:from-gray-800/25 dark:to-gray-800/10 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 text-slate-700 dark:text-slate-200 hover:from-white/25 hover:to-white/10 dark:hover:from-gray-800/35 dark:hover:to-gray-800/20 hover:border-blue-400/60 dark:hover:border-blue-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="হোম পেজে ফিরুন"
          title="হোম পেজে ফিরুন"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B7FFF]/10 via-[#4a9fff]/10 to-[#2B7FFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icons with staggered animation */}
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
          </div>

          {/* Text with gradient effect - hidden on very small screens */}
          <span className="relative text-xs sm:text-sm font-bold bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-200 dark:to-slate-300 bg-clip-text text-transparent group-hover:from-[#2B7FFF] group-hover:to-[#4a9fff] dark:group-hover:from-[#2B7FFF] dark:group-hover:to-[#4a9fff] transition-all duration-300 hidden xs:inline">
            Back to Home
          </span>

          {/* Shine effect */}
          <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>
        <AuthThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 glass-card border-0 rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300">
        {children}
      </div>
    </div>
  )
}

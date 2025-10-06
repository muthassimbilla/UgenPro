"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  activeSection?: string
}

export function Navigation({ activeSection = "hero" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { id: "hero", label: "Home", href: "#hero" },
    { id: "tools", label: "Tools", href: "#tools" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
    { id: "contact", label: "Contact", href: "#contact" },
  ]

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 20)
      }, 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong border-b border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
          : "glass backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl transition-transform group-hover:scale-110 shadow-glow">
            <img src="/ugenpro-logo.svg" alt="UGen Pro Logo" className="w-full h-full rounded-xl" />
          </div>
          <span className="font-bold text-xl gradient-text">UGen Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`px-5 py-2.5 text-sm font-semibold transition-all rounded-xl relative overflow-hidden group ${
                activeSection === item.id
                  ? "text-primary bg-primary/10 shadow-glow border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50 hover:shadow-sm border border-transparent hover:border-border/50"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50 rounded-xl" />
              )}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link href="/login" className="hidden sm:block">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold rounded-xl border-2 border-emerald-500/30 hover:border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm hover:shadow-glow"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
          <Button
            size="sm"
            className="bg-[#2B7FFF] hover:bg-[#1a6bff] text-white font-semibold shadow-glow hover:shadow-glow-accent transition-all interactive-scale rounded-xl px-6 border-2 border-white/10"
          >
              Get Started
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-card/50 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/30 glass-strong">
          <div className="container mx-auto px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`block px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-primary/20 to-accent/10 text-primary border border-primary/30 shadow-glow"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground border border-transparent hover:border-border/50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-2 border-border/50 hover:border-primary/50 font-semibold bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-[#8e2de2] via-[#4a9fff] to-[#ff4b8a] hover:from-[#7a1fd4] hover:via-[#3a8fef] hover:to-[#ef3b7a] text-white font-semibold shadow-glow hover:shadow-glow-accent transition-all interactive-scale rounded-xl px-6 border-2 border-white/10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

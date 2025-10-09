import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ClientProviders from "@/components/client-providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ugenpro.site'),
  title: {
    default: "UGen Pro - Advanced Generator Tools Platform",
    template: "%s | UGen Pro"
  },
  description:
    "The complete platform for advanced generator tools. Create user agents, addresses, email2name, and more with our powerful and secure tools.",
  keywords: "generator tools, user agent generator, address generator, email2name, online tools, productivity tools",
  authors: [{ name: "UGen Pro" }],
  creator: "UGen Pro",
  publisher: "UGen Pro",
  generator: "Next.js",
  applicationName: "UGen Pro",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon-32x32.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/ugenpro-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/ugenpro-logo.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "UGen Pro - Advanced Generator Tools Platform",
    description: "The complete platform for advanced generator tools. Create user agents, addresses, email2name, and more with our powerful and secure tools.",
    type: "website",
    url: "https://ugenpro.site",
    siteName: "UGen Pro",
    images: [
      {
        url: "/ugenpro-social-sharing.jpg",
        width: 1200,
        height: 630,
        alt: "UGen Pro - Advanced Generator Tools Platform",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UGen Pro - Advanced Generator Tools Platform",
    description: "The complete platform for advanced generator tools. Create user agents, addresses, email2name, and more with our powerful and secure tools.",
    images: ["/ugenpro-social-sharing.jpg"],
    creator: "@ugenpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2B7FFF" },
    { media: "(prefers-color-scheme: dark)", color: "#2B7FFF" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={true}
          storageKey="taskflow-theme"
        >
          <ClientProviders>{children}</ClientProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

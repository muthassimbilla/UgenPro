import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Noto_Sans_Bengali } from "next/font/google"
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

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  variable: "--font-noto-bengali",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ugenpro.site'),
  title: {
    default: "UGen Pro - Advanced Generator Tools Platform | User Agent Generator, Address Generator, Email2Name",
    template: "%s | UGen Pro"
  },
  description:
    "Professional generator tools platform offering user agent generator, address generator, email2name converter, and more. Fast, secure, and reliable online tools for developers and professionals in Bangladesh.",
  keywords: "generator tools, user agent generator, address generator, email2name, online tools, productivity tools, Bangladesh, Dhaka, developer tools, web tools, free online generators",
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
    title: "UGen Pro - Advanced Generator Tools Platform | User Agent Generator, Address Generator, Email2Name",
    description: "Professional generator tools platform offering user agent generator, address generator, email2name converter, and more. Fast, secure, and reliable online tools for developers and professionals in Bangladesh.",
    type: "website",
    url: "https://ugenpro.site",
    siteName: "UGen Pro",
    images: [
      {
        url: "/ugenpro-social-sharing.jpg",
        width: 1200,
        height: 630,
        alt: "UGen Pro - Advanced Generator Tools Platform with User Agent Generator, Address Generator, Email2Name tools",
      },
    ],
    locale: "en_US",
    alternateLocale: ["bn_BD"],
  },
  // facebook: {
  //   appId: "your-facebook-app-id", // Replace with your actual Facebook App ID
  // },
  twitter: {
    card: "summary_large_image",
    title: "UGen Pro - Advanced Generator Tools Platform | User Agent Generator, Address Generator, Email2Name",
    description: "Professional generator tools platform offering user agent generator, address generator, email2name converter, and more. Fast, secure, and reliable online tools for developers and professionals in Bangladesh.",
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
      <head>
        <link rel="canonical" href="https://ugenpro.site" />
        <link rel="alternate" hrefLang="en" href="https://ugenpro.site" />
        <link rel="alternate" hrefLang="bn" href="https://ugenpro.site/bn" />
        <link rel="alternate" hrefLang="x-default" href="https://ugenpro.site" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "UGen Pro",
              "description": "Professional generator tools platform offering user agent generator, address generator, email2name converter, and more.",
              "url": "https://ugenpro.site",
              "logo": "https://ugenpro.site/ugenpro-logo.svg",
              "image": "https://ugenpro.site/ugenpro-social-sharing.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dhaka",
                "addressCountry": "BD"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Bengali"]
              },
              "sameAs": [
                "https://twitter.com/ugenpro"
              ],
              "offers": {
                "@type": "Offer",
                "description": "Free online generator tools",
                "price": "0",
                "priceCurrency": "USD"
              },
              "serviceArea": {
                "@type": "Country",
                "name": "Bangladesh"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} ${notoSansBengali.variable}`} suppressHydrationWarning>
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

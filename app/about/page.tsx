import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutMission } from "@/components/about/about-mission"
import { AboutTools } from "@/components/about/about-tools"
import { AboutFAQ } from "@/components/about/about-faq"
import { AboutCTA } from "@/components/about/about-cta"

export const metadata: Metadata = {
  title: "About UGen Pro - Professional CPA Signup Generator Tools Platform",
  description:
    "Learn about UGen Pro, the leading platform for CPA signup generator tools. Discover our User Agent Generator, Address Generator, and Email2Name tools designed for professionals and developers.",
  keywords:
    "about UGen Pro, CPA signup tools, user agent generator, address generator, email2name converter, generator tools platform, CPA tools provider",
  openGraph: {
    title: "About UGen Pro - Professional CPA Signup Generator Tools",
    description:
      "Discover UGen Pro's mission to provide fast, reliable, and secure CPA signup generator tools for professionals worldwide.",
    type: "website",
    url: "https://ugenpro.site/about",
    images: [
      {
        url: "/ugenpro-social-sharing.jpg",
        width: 1200,
        height: 630,
        alt: "UGen Pro - About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About UGen Pro - CPA Signup Generator Tools",
    description: "Learn about UGen Pro's professional CPA signup generator tools and our commitment to innovation.",
    images: ["/ugenpro-social-sharing.jpg"],
  },
  alternates: {
    canonical: "https://ugenpro.site/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection="about" />

      <main className="relative z-10">
        <AboutHero />
        <AboutMission />
        <AboutTools />
        <AboutFAQ />
        <AboutCTA />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About UGen Pro",
            description:
              "UGen Pro is a professional platform providing CPA signup generator tools including User Agent Generator, Address Generator, and Email2Name converter.",
            url: "https://ugenpro.site/about",
            mainEntity: {
              "@type": "Organization",
              name: "UGen Pro",
              alternateName: "UGen Pro - CPA Tools",
              description:
                "Professional CPA signup generator tools platform offering User Agent Generator, Address Generator, Email2Name converter, and more.",
              url: "https://ugenpro.site",
              logo: "https://ugenpro.site/ugenpro-logo.svg",
              image: "https://ugenpro.site/ugenpro-social-sharing.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dhaka",
                addressCountry: "BD",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["English", "Bengali"],
                email: "support@ugenpro.site",
              },
              sameAs: ["https://twitter.com/ugenpro"],
              foundingDate: "2024",
              areaServed: ["BD", "Global"],
              serviceType: "CPA Signup Generator Tools",
              knowsAbout: [
                "User Agent Generation",
                "Address Generation",
                "Email to Name Conversion",
                "CPA Signup Automation",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "CPA Generator Tools",
                itemListElement: [
                  {
                    "@type": "Offer",
                    name: "User Agent Generator",
                    description: "Generate realistic user agent strings for web browsers and devices",
                  },
                  {
                    "@type": "Offer",
                    name: "Address Generator",
                    description: "Create valid addresses for CPA signup forms and testing",
                  },
                  {
                    "@type": "Offer",
                    name: "Email2Name Converter",
                    description: "Convert email addresses to names for data enrichment",
                  },
                ],
              },
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is UGen Pro?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "UGen Pro is a professional platform providing fast, reliable, and secure CPA signup generator tools designed for developers, businesses, and professionals.",
                },
              },
              {
                "@type": "Question",
                name: "What tools does UGen Pro offer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "UGen Pro offers three main tools: User Agent Generator for creating realistic browser identifiers, Address Generator for valid address creation, and Email2Name converter for email-to-name conversion.",
                },
              },
              {
                "@type": "Question",
                name: "Is UGen Pro secure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, UGen Pro uses enterprise-grade security with end-to-end encryption and data protection to ensure your data is safe.",
                },
              },
              {
                "@type": "Question",
                name: "How fast are UGen Pro tools?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "UGen Pro tools provide instant results with 99.9% uptime reliability, ensuring lightning-fast generation for your CPA signup needs.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}

import { MapPin, Mail, Monitor } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Tool {
  id: string
  name: string
  description: string
  icon: LucideIcon
  features: string[]
  demoImage?: string
  demoVideo?: string
  ctaText: string
  ctaLink: string
  color: string
}

export const toolsData: Tool[] = [
  {
    id: "user-agent-generator",
    name: "User Agent Generator",
    description:
      "Generate realistic user agent strings for CPA campaigns and browser testing. Perfect for CPA self signup and marketing automation.",
    icon: Monitor,
    features: [
      "Generate user agents for Chrome, Firefox, Safari, Edge",
      "Support for mobile and desktop devices",
      "CPA campaign optimization",
      "Copy with one click",
      "Bulk generation for campaigns",
    ],
    demoVideo: "https://www.youtube.com/embed/ScMzIvxBSi4?controls=1&rel=0&modestbranding=1&autoplay=0&mute=0",
    ctaText: "Use User Agent Generator",
    ctaLink: "/tool/user-agent-generator",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  },
  {
    id: "address-generator",
    name: "Address Generator",
    description:
      "Generate realistic US addresses for CPA campaigns and lead generation. Essential tool for CPA self signup and marketing automation.",
    icon: MapPin,
    features: [
      "Generate addresses from IP addresses",
      "Generate addresses from ZIP codes",
      "CPA campaign address generation",
      "Copy individual fields or full address",
      "Bulk address generation for campaigns",
    ],
    demoVideo: "https://www.youtube.com/embed/ScMzIvxBSi4?controls=1&rel=0&modestbranding=1&autoplay=0&mute=0",
    ctaText: "Use Address Generator",
    ctaLink: "/tool/address-generator",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    id: "email2name",
    name: "Email to Name",
    description:
      "Transform email addresses into realistic names for CPA campaigns and lead generation. AI-powered tool for CPA self signup.",
    icon: Mail,
    features: [
      "AI-powered name generation",
      "Generate full name, first name, and last name",
      "CPA campaign name generation",
      "Auto-generate on paste feature",
      "Bulk name generation for campaigns",
    ],
    demoVideo: "https://www.youtube.com/embed/ScMzIvxBSi4?controls=1&rel=0&modestbranding=1&autoplay=0&mute=0",
    ctaText: "Use Email2Name",
    ctaLink: "/tool/email2name",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
]

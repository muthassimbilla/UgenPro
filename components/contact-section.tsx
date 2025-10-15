"use client"

import { MessageCircle, User, ExternalLink } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: MessageCircle,
      title: "Telegram Channel",
      value: "Join our community",
      description: "Join our community for updates and discussions",
      color: "from-cyan-500 to-cyan-600",
      actionText: "Join Channel",
      actionLink: "https://t.me/+DS9l9qeSDfgxODI9",
      actionIcon: ExternalLink,
    },
    {
      icon: User,
      title: "Admin Account",
      value: "Contact our admin",
      description: "Direct contact with our admin team",
      color: "from-purple-500 to-purple-600",
      actionText: "Contact Admin",
      actionLink: "https://t.me/ugenpro_admin",
      actionIcon: ExternalLink,
    },
  ]

  return (
    <section id="contact" className="relative py-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[#2B7FFF]/5 via-[#4a9fff]/3 to-background dark:via-[#2B7FFF]/10 dark:via-[#4a9fff]/8" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#2B7FFF]/15 via-[#4a9fff]/15 to-[#2B7FFF]/15 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow border-2 border-[#2B7FFF]/60 hover:border-[#2B7FFF]/80 text-sm font-bold mb-3 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#2B7FFF]/10 to-[#4a9fff]/10 dark:from-[#2B7FFF]/20 dark:to-[#4a9fff]/20">
            <MessageCircle className="w-4 h-4 text-[#2B7FFF] dark:text-[#2B7FFF]" />
            <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent font-bold">
              Contact Us
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            <span className="text-shadow-lg">Get in</span>
            <span className="bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent text-shadow-lg ml-4">
              Touch
            </span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're here to help you succeed. Reach out to our team through any of the channels below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto px-4 sm:px-0">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon
            const isChannel = index === 0
            return (
              <div key={index} className="group relative w-full sm:w-80 lg:w-96 xl:w-[28rem]">
                <div
                  className="group relative overflow-hidden cursor-pointer transition-all duration-500 rounded-3xl bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-gray-900/95 dark:via-blue-950/90 dark:to-gray-900/95 shadow-xl border-2 border-[#2B7FFF]/40 hover:border-[#2B7FFF]/60 dark:border-[#2B7FFF]/50 dark:hover:border-[#2B7FFF]/70 hover:shadow-2xl hover:shadow-[#2B7FFF]/25 hover:-translate-y-3 h-full"
                  style={{ willChange: "transform", transform: "translateZ(0)" }}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${isChannel ? "from-[#4a9fff]/10 via-[#2B7FFF]/10 to-[#4a9fff]/10" : "from-[#2B7FFF]/10 via-[#4a9fff]/10 to-[#2B7FFF]/10"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="p-6 sm:p-8 space-y-4 sm:space-y-6 h-full flex flex-col relative z-10">
                    {/* Icon with gradient background */}
                    <div className="flex items-center justify-between">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2B7FFF]/20 via-[#4a9fff]/20 to-[#2B7FFF]/20 border-2 border-[#2B7FFF]/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <IconComponent className="h-7 w-7 text-[#2B7FFF] dark:text-[#2B7FFF]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 flex-1">
                      {/* Title with gradient */}
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] bg-clip-text text-transparent">
                        {contact.title}
                      </h3>

                      {/* Description */}
                      <p className="text-base text-muted-foreground leading-relaxed font-medium">
                        {contact.description}
                      </p>

                      {/* Contact info badge */}
                      <div className="space-y-2">
                        <span className="inline-block font-semibold text-sm px-4 py-2 rounded-xl glass border-2 border-[#2B7FFF]/40 text-[#2B7FFF] dark:text-[#2B7FFF]">
                          {contact.value}
                        </span>
                      </div>
                    </div>

                    {/* Action button with gradient */}
                    <a
                      href={contact.actionLink}
                      target={contact.actionLink.startsWith("http") ? "_blank" : "_self"}
                      rel={contact.actionLink.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group/btn relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#2B7FFF] via-[#4a9fff] to-[#2B7FFF] hover:from-[#1a6bff] hover:via-[#3a8fef] hover:to-[#1a6bff] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <contact.actionIcon className="w-5 h-5" />
                        <span className="text-base">{contact.actionText}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

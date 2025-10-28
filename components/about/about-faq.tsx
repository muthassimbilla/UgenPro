export function AboutFAQ() {
  const faqs = [
    {
      question: "What is UGen Pro?",
      answer:
        "UGen Pro is a professional platform providing fast, reliable, and secure CPA signup generator tools. We offer User Agent Generator, Address Generator, and Email2Name converter designed for developers, businesses, and professionals.",
    },
    {
      question: "How secure is UGen Pro?",
      answer:
        "UGen Pro uses enterprise-grade security with end-to-end encryption and data protection. We maintain 99.9% uptime reliability and comply with international data protection standards.",
    },
    {
      question: "What are the main tools offered?",
      answer:
        "We offer three core tools: User Agent Generator for creating realistic browser identifiers, Address Generator for valid address creation, and Email2Name converter for email-to-name conversion.",
    },
    {
      question: "How fast are the tools?",
      answer:
        "UGen Pro tools provide instant results with 99.9% uptime reliability. Most generations complete in milliseconds, ensuring lightning-fast performance for your CPA signup needs.",
    },
    {
      question: "Do you support bulk operations?",
      answer:
        "Yes, our tools support bulk generation and batch processing. You can generate multiple results efficiently, making it perfect for large-scale CPA signup operations.",
    },
    {
      question: "What languages do you support?",
      answer:
        "We provide customer support in English and Bengali. Our tools support multiple countries and address formats for global CPA signup operations.",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Find answers to common questions about UGen Pro</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-foreground">
                  {faq.question}
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

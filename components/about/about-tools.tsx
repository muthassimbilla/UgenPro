export function AboutTools() {
  const tools = [
    {
      name: "User Agent Generator",
      description:
        "Generate realistic user agent strings for CPA campaigns and browser testing. Perfect for CPA self signup and marketing automation.",
      features: [
        "Generate Facebook and Instagram User Agents for iPhone, Samsung, Pixel, and more devices.",
        "Generate bulk user agents in one click",
        "Generate unlimited real user agents",
        "CPA campaign optimization",
        "Always updated user agents",
        "One click copy and download facility.",
      ],
    },
    {
      name: "Address Generator",
      description:
        "Generate realistic US addresses for CPA campaigns and lead generation. Essential tool for CPA self signup and marketing automation.",
      features: [
        "Generate addresses from IP addresses",
        "Generate addresses from ZIP codes",
        "CPA campaign address generation",
        "Copy individual fields or full address (fast copy)",
        "Easy to use.",
      ],
    },
    {
      name: "Email to Name",
      description:
        "Transform email addresses into realistic names for CPA campaigns and lead generation. AI-powered tool for CPA self signup.",
      features: [
        "Generate full name, first & last name with gender.",
        "CPA campaign name generation.",
        "Auto-generate on paste feature",
        "Auto-generate on paste feature (fast work).",
      ],
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Core Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three powerful tools designed specifically for CPA signup professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <article
                key={tool.name}
                className="space-y-4 p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-foreground">{tool.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Key Features:</p>
                  <ul className="space-y-1">
                    {tool.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

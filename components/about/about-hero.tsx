export function AboutHero() {
  return (
    <section
      id="about-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-8 md:pt-24 md:pb-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex items-center justify-center">
          <div className="space-y-8 max-w-3xl text-center">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                About <span className="text-primary">UGen Pro</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                We're building the most trusted platform for CPA signup generator tools, empowering professionals
                worldwide with fast, reliable, and secure solutions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime Reliability</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">3</div>
                <p className="text-sm text-muted-foreground">Core Tools</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">Global</div>
                <p className="text-sm text-muted-foreground">Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutMission() {
  return (
    <section className="py-12 md:py-16 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering professionals with innovative, reliable, and secure CPA signup solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="space-y-4 p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide fast, reliable, and secure CPA signup generator tools that simplify workflows and empower
                professionals to achieve their goals efficiently without technical barriers.
              </p>
            </article>

            <article className="space-y-4 p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and comprehensive platform for CPA-focused generator tools worldwide, serving
                millions of users with innovative solutions that drive measurable success.
              </p>
            </article>

            <article className="space-y-4 p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Our Values</h3>
              <p className="text-muted-foreground leading-relaxed">
                We prioritize reliability, security, and innovation. We're committed to continuous improvement,
                transparency, and delivering exceptional value to our users.
              </p>
            </article>
          </div>

          <div className="p-8 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-6">Why Choose UGen Pro?</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  <strong>Lightning-Fast Generation:</strong> Instant results with 99.9% uptime reliability
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  <strong>Enterprise-Grade Security:</strong> End-to-end encryption and data protection
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  <strong>Continuously Innovating:</strong> Regular updates with new tools and features
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  <strong>Professional Support:</strong> Dedicated customer service in English and Bengali
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

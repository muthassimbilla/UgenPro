export function AboutValues() {
  const values = [
    {
      title: "Innovation",
      description: "We constantly push boundaries to create cutting-edge solutions that solve real problems.",
      icon: "🚀",
    },
    {
      title: "Reliability",
      description: "Our tools are built to perform consistently, with enterprise-grade uptime and security.",
      icon: "🛡️",
    },
    {
      title: "User-Centric",
      description: "Every feature is designed with our users in mind, prioritizing simplicity and efficiency.",
      icon: "👥",
    },
    {
      title: "Transparency",
      description: "We believe in open communication and honest relationships with our community.",
      icon: "🔍",
    },
    {
      title: "Excellence",
      description: "We maintain the highest standards in code quality, performance, and customer service.",
      icon: "⭐",
    },
    {
      title: "Community",
      description: "We foster a supportive ecosystem where developers can learn, share, and grow together.",
      icon: "🤝",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Core Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do and shape our culture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

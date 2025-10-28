export function AboutTeam() {
  const team = [
    {
      name: "Founder & CEO",
      role: "Visionary Leader",
      description: "Leading UGen Pro with a passion for developer tools and innovation.",
      image: "/professional-team-member.jpg",
    },
    {
      name: "Lead Developer",
      role: "Technical Excellence",
      description: "Architecting robust solutions and ensuring code quality across all tools.",
      image: "/developer-professional.jpg",
    },
    {
      name: "Product Manager",
      role: "User Experience",
      description: "Crafting intuitive interfaces and prioritizing user needs in every feature.",
      image: "/product-manager.jpg",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Talented professionals dedicated to creating exceptional tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
              <p className="text-muted-foreground leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

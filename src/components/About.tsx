import { Headphones, Music, Mic2, Sliders } from "lucide-react";

const services = [
  {
    icon: Sliders,
    title: "Mixing",
    description:
      "Balancing every element to create a cohesive, dynamic mix that translates across all systems.",
  },
  {
    icon: Headphones,
    title: "Mastering",
    description:
      "Final polish and loudness optimization to ensure your music competes on any platform.",
  },
  {
    icon: Mic2,
    title: "Vocal Production",
    description:
      "Expert vocal editing, tuning, and processing to make your vocals shine.",
  },
  {
    icon: Music,
    title: "Sound Design",
    description:
      "Creative sound design and audio post-production for music, film, and media.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div className="order-2 md:order-1">
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
                About Me
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-6">
                Passionate About
                <span className="block font-medium">Sonic Excellence</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  With over a decade of experience in the audio industry, I've had the 
                  privilege of working with talented artists across genres—from intimate 
                  acoustic sessions to full-scale productions.
                </p>
                <p>
                  My approach combines technical precision with creative intuition. I believe 
                  every project deserves individual attention and a personalized touch that 
                  honors the artist's unique vision.
                </p>
                <p>
                  Based in Los Angeles, I work with clients worldwide, bringing warmth, 
                  clarity, and professional polish to every mix and master.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-[4/5] bg-secondary rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">Your Photo Here</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Services
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
              What I <span className="font-medium">Offer</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-6 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

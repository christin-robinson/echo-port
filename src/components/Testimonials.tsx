import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Working with her was an absolute dream. She understood my vision immediately and elevated my tracks beyond what I imagined. The attention to detail is incredible.",
    author: "Sarah Mitchell",
    role: "Singer-Songwriter",
    project: "Midnight Dreams EP",
  },
  {
    quote:
      "Professional, creative, and incredibly talented. My album has never sounded better. She brings both technical expertise and artistic sensibility to every project.",
    author: "Marcus Chen",
    role: "Producer",
    project: "Urban Poetry Album",
  },
  {
    quote:
      "She has a rare gift for enhancing music while preserving its soul. The masters she delivered were warm, punchy, and absolutely radio-ready.",
    author: "Elena Rodriguez",
    role: "Artist & Vocalist",
    project: "Golden Hour Single",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-4">
              What Clients <span className="font-medium">Say</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hear from artists and producers I've had the pleasure of working with.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative bg-background rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                <blockquote className="text-foreground leading-relaxed mb-6 relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-6">
                  <p className="font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-primary mt-1">{testimonial.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

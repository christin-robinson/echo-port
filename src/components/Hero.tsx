import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, useState, useEffect } from "react";
import AudioGeometry from "./AudioGeometry";

const Hero = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToPortfolio = () => {
    const element = document.querySelector("#portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Audio Geometry Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <AudioGeometry scrollProgress={scrollProgress} />
      </Suspense>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-background/40" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
            Emerging Sound Engineer
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-6 animate-fade-in">
            Passionate About
            <span className="block font-medium text-primary">Every Frequency</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in">
            A fresh voice in audio engineering, bringing unwavering dedication and 
            a deep love for sound to every project. Ready to craft your sonic vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button
              onClick={scrollToPortfolio}
              size="lg"
              className="rounded-full px-8"
            >
              Explore My Work
            </Button>
            <Button
              onClick={scrollToContact}
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              Let's Create Together
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToPortfolio}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce z-10"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </button>
    </section>
  );
};

export default Hero;

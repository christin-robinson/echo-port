import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Midnight Dreams",
    artist: "Aurora Waves",
    type: "Album Mix & Master",
    image: null,
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Electric Soul",
    artist: "The Neon Collective",
    type: "Single Production",
    image: null,
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Whispers in Time",
    artist: "Luna Sierra",
    type: "EP Mastering",
    image: null,
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Urban Poetry",
    artist: "Metro Rhymes",
    type: "Full Mix",
    image: null,
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Ocean Tides",
    artist: "Coastal Sounds",
    type: "Album Mastering",
    image: null,
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Golden Hour",
    artist: "Sunset Sessions",
    type: "Mix & Master",
    image: null,
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-4">
              Featured <span className="font-medium">Work</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A selection of recent projects showcasing my mixing and mastering work 
              across various genres.
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300"
              >
                {/* Album Art Placeholder */}
                <div className="aspect-square bg-secondary relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Album Art</span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      asChild
                    >
                      <a href={project.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      asChild
                    >
                      <a href={project.soundcloudUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                </div>
                {/* Project Info */}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-primary mb-1">
                    {project.type}
                  </p>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.artist}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Embedded Player Section */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-medium text-foreground mb-6 text-center">
              Listen Now
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Spotify Embed Placeholder */}
              <div className="bg-secondary rounded-xl p-6 h-[160px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  Spotify Embed<br />
                  <span className="text-xs">(Replace with your embed code)</span>
                </p>
              </div>
              {/* SoundCloud Embed Placeholder */}
              <div className="bg-secondary rounded-xl p-6 h-[160px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  SoundCloud Embed<br />
                  <span className="text-xs">(Replace with your embed code)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

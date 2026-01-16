import { ExternalLink, Play, Music, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Kannamma Kaadhal",
    artist: "Priya Selvam",
    type: "Tamil Single Mix",
    language: "Tamil",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Mazha Thullikal",
    artist: "Arun Menon",
    type: "Malayalam Album",
    language: "Malayalam",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Nenjil Maamaram",
    artist: "Kavitha Krishnan",
    type: "Tamil EP Mastering",
    language: "Tamil",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Theeram",
    artist: "Deepak Nair",
    type: "Malayalam Single",
    language: "Malayalam",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Kadhal Payanam",
    artist: "Surya & Divya",
    type: "Tamil Duet Mix",
    language: "Tamil",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
  {
    title: "Poomaram",
    artist: "Reshma Thomas",
    type: "Malayalam Folk Mix",
    language: "Malayalam",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
    spotifyUrl: "#",
    soundcloudUrl: "#",
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Featured Work
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-6">
              Recent Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collection of my mixing and mastering work across Tamil and Malayalam music, 
              spanning various genres from classical fusion to contemporary pop.
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Album Art */}
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.title} by ${project.artist}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-primary-foreground fill-current" />
                    </div>
                  </div>

                  {/* Language Badge */}
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-xs px-3 py-1 rounded-full text-foreground">
                    {project.language}
                  </span>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <p className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">
                    {project.type}
                  </p>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.artist}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                      asChild
                    >
                      <a href={project.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        <Music className="w-4 h-4 mr-2" />
                        Spotify
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                      asChild
                    >
                      <a href={project.soundcloudUrl} target="_blank" rel="noopener noreferrer">
                        <Headphones className="w-4 h-4 mr-2" />
                        SoundCloud
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Listen Now Section */}
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-medium text-foreground mb-3">
                Listen Now
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Stream my latest mixes and productions on your favorite platforms
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Spotify Embed */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-foreground">Spotify</span>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <iframe 
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    title="Spotify Playlist"
                  />
                </div>
              </div>

              {/* SoundCloud Embed */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF5500] flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-foreground">SoundCloud</span>
                </div>
                <div className="rounded-xl overflow-hidden bg-secondary">
                  <iframe 
                    width="100%" 
                    height="352" 
                    scrolling="no" 
                    frameBorder="no" 
                    allow="autoplay"
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1&color=%23e94560&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                    title="SoundCloud Playlist"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10 pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">
                Want to hear more? Check out my full catalog
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="rounded-full px-8" asChild>
                  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
                    <Music className="w-4 h-4 mr-2" />
                    Follow on Spotify
                  </a>
                </Button>
                <Button variant="outline" className="rounded-full px-8" asChild>
                  <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">
                    <Headphones className="w-4 h-4 mr-2" />
                    Follow on SoundCloud
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

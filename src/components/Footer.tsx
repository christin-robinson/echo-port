const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Studio Name. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Crafted with passion for music
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold text-primary text-glow tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          PORTFOLIO
        </a>
        
        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActive(link.href.slice(1))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                active === link.href.slice(1)
                  ? "text-primary bg-primary/10 neon-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="space-y-1.5">
            <motion.div className="w-6 h-0.5 bg-primary" animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }} />
            <motion.div className="w-6 h-0.5 bg-primary" animate={{ opacity: mobileOpen ? 0 : 1 }} />
            <motion.div className="w-6 h-0.5 bg-primary" animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => { setActive(link.href.slice(1)); setMobileOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active === link.href.slice(1)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

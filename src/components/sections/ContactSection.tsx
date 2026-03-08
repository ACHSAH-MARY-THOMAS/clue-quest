import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";

const links = [
  { icon: Mail, label: "your.email@example.com", href: "mailto:your.email@example.com" },
  { icon: Github, label: "github.com/yourusername", href: "https://github.com" },
  { icon: Linkedin, label: "linkedin.com/in/yourusername", href: "https://linkedin.com" },
  { icon: Phone, label: "+91 XXXXX XXXXX", href: "tel:+91" },
  { icon: MapPin, label: "Your City, India", href: "#" },
];

export const ContactSection = () => (
  <section id="contact" className="py-24 px-6 relative overflow-hidden">
    {/* Cinematic gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
    
    {/* Radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
    
    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `linear-gradient(hsl(var(--neon-purple)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple)) 1px, transparent 1px)`,
      backgroundSize: "40px 40px",
    }} />

    <div className="max-w-4xl mx-auto text-center relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Movie ending style */}
        <motion.p
          className="text-accent text-sm tracking-[0.5em] uppercase mb-6 font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          The End... or Just the Beginning?
        </motion.p>
        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-wider">
          <span className="text-glow">Get In Touch</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-accent via-primary to-accent mb-4 rounded-full mx-auto" />
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-lg mx-auto italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          "Creating the future with code."
        </motion.p>
      </motion.div>

      <div className="flex flex-col items-center gap-4 mb-16">
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-8 py-5 w-full max-w-md rounded-xl border border-border bg-card/80 backdrop-blur-sm card-glow hover:border-primary/50 transition-all duration-300 group"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <link.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-foreground group-hover:text-primary transition-colors text-sm">{link.label}</span>
          </motion.a>
        ))}
      </div>

      {/* Movie credits style footer */}
      <motion.div
        className="border-t border-border/50 pt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-2">
          Directed & Developed by
        </p>
        <p className="text-lg font-bold text-primary text-glow tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Your Name
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          © 2026 All rights reserved. Built with React & ❤️
        </p>
      </motion.div>
    </div>
  </section>
);

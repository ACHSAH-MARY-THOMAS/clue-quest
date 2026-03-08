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
  <section id="contact" className="py-24 px-6 bg-card/50">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Get In Touch</h2>
        <div className="w-16 h-1 bg-primary mb-6 rounded-full mx-auto" />
        <p className="text-muted-foreground mb-10 max-w-md mx-auto">
          Feel free to reach out for collaborations, opportunities, or just to say hello!
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-4 w-full max-w-md rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <link.icon className="w-5 h-5 text-primary" />
            <span className="text-foreground group-hover:text-primary transition-colors">{link.label}</span>
          </motion.a>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted-foreground">
        © 2026 Your Name. All rights reserved.
      </p>
    </div>
  </section>
);

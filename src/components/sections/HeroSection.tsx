import { motion } from "framer-motion";
import { PortalPhoto } from "../PortalPhoto";

export const HeroSection = () => (
  <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
    <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">
      <motion.div
        className="flex-1 text-center md:text-left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-primary font-medium mb-2 tracking-wide">Hello, I'm</p>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          Your Name
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-8">
          Full Stack Developer & Creative Problem Solver. Building digital experiences with modern technologies.
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          <a href="#projects" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            View Projects
          </a>
          <a href="#contact" className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
            Contact Me
          </a>
        </div>
      </motion.div>
      <motion.div
        className="flex-shrink-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <PortalPhoto />
      </motion.div>
    </div>
  </section>
);

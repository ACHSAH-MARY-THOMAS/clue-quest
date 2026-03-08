import { motion } from "framer-motion";
import { PortalPhoto } from "../PortalPhoto";

export const HeroSection = () => (
  <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
    {/* Background ambient particles */}
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `hsl(${270 + Math.random() * 40}, 80%, ${50 + Math.random() * 30}%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [0, -40, -80],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>

    <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-16 relative z-10">
      <motion.div
        className="flex-1 text-center md:text-left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.p
          className="text-accent font-medium mb-3 tracking-[0.3em] uppercase text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Hello, I'm
        </motion.p>
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-2 leading-tight tracking-wider">
          <span className="text-glow">Your Name</span>
        </h1>
        <motion.p
          className="text-lg text-accent font-semibold mb-4 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Building Digital Worlds with Code
        </motion.p>
        <p className="text-base text-muted-foreground max-w-lg mb-8 leading-relaxed">
          Full Stack Developer & Creative Problem Solver. Crafting futuristic digital experiences with modern technologies.
        </p>
        <div className="flex gap-3 mb-6 justify-center md:justify-start flex-wrap">
          {["Java", "Python", "React", "Node.js", "TypeScript"].map((tech, i) => (
            <motion.span
              key={tech}
              className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
        <div className="flex gap-4 justify-center md:justify-start">
          <a href="#projects" className="px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all neon-border hover:scale-105 duration-300">
            View Projects
          </a>
          <a href="#contact" className="px-7 py-3 rounded-lg border border-border text-foreground hover:border-accent hover:text-accent transition-all duration-300">
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

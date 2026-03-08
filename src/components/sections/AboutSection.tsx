import { motion } from "framer-motion";

const skills = [
  "Python", "Java", "JavaScript", "TypeScript", "React", "Node.js", "HTML/CSS", "SQL",
  "Git", "Docker", "MongoDB", "REST APIs"
];

export const AboutSection = () => (
  <section id="about" className="py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">About Me</h2>
        <div className="w-16 h-1 bg-primary mb-8 rounded-full" />
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          I'm a passionate developer with a keen eye for design and a love for building impactful software. 
          With experience across the full stack, I enjoy turning complex problems into elegant solutions. 
          I'm always learning and pushing my boundaries to stay current with the latest technologies.
        </p>
        <div className="flex flex-wrap gap-3">
          {skills.map(skill => (
            <span key={skill} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm border border-border hover:border-primary/50 hover:bg-primary/10 transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

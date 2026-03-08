import { motion } from "framer-motion";
import { CyberFrame, CyberSectionHeader } from "../CyberFrame";

const skillCategories = [
  {
    title: "💻 Languages",
    skills: ["Python", "Java", "JavaScript", "TypeScript", "C"],
  },
  {
    title: "🌐 Web",
    skills: ["HTML", "CSS", "React", "Node.js", "REST APIs"],
  },
  {
    title: "🛠️ Tools",
    skills: ["Git", "Docker", "MongoDB", "PostgreSQL", "Linux"],
  },
];

const characterStats = {
  level: "Computer Science Student",
  class: "Software Developer",
  specialAbility: "Problem Solving",
  xp: 85,
};

export const AboutSection = () => (
  <section id="about" className="py-24 px-6 relative">
    <div className="max-w-5xl mx-auto">
      <CyberSectionHeader icon="⚡" title="About Me" subtitle="profile.init" />

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.p
          className="text-muted-foreground text-lg leading-relaxed"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          I'm a passionate developer with a keen eye for design and a love for building impactful software.
          With experience across the full stack, I enjoy turning complex problems into elegant, futuristic solutions.
          Always pushing boundaries to stay at the cutting edge.
        </motion.p>

        {/* Character Stats — Cyberpunk HUD Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <CyberFrame className="rounded-xl border border-primary/30 bg-card p-6 neon-border overflow-hidden">
            <div className="scanlines" />
            <h3
              className="text-sm font-bold text-primary tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Character Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono text-xs">Level:</span>
                <span className="text-foreground font-medium">{characterStats.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono text-xs">Class:</span>
                <span className="text-accent font-medium">{characterStats.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono text-xs">Special:</span>
                <span className="text-primary font-medium">{characterStats.specialAbility}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground font-mono text-xs">XP</span>
                  <span className="text-foreground text-xs">{characterStats.xp}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${characterStats.xp}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </CyberFrame>
        </motion.div>
      </div>

      {/* Skill Cards with cyber frames */}
      <div className="grid md:grid-cols-3 gap-6">
        {skillCategories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <CyberFrame className="rounded-xl border border-border bg-card p-6 card-glow hover:border-primary/50 transition-all duration-300">
              <h3
                className="text-lg font-bold text-foreground mb-4"
                style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
              >
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CyberFrame>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

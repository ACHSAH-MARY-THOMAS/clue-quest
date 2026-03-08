import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-stack web app with React, Node.js, and MongoDB. Features auth, payments, and real-time inventory.",
    tags: ["React", "Node.js", "MongoDB"],
    emoji: "🛒",
  },
  {
    title: "AI Chat Assistant",
    desc: "Python-based chatbot using NLP for customer support automation with 95% accuracy.",
    tags: ["Python", "NLP", "Flask"],
    emoji: "🤖",
  },
  {
    title: "Task Management App",
    desc: "Collaborative project management tool with real-time updates and team features.",
    tags: ["TypeScript", "React", "PostgreSQL"],
    emoji: "📋",
  },
  {
    title: "Portfolio Website",
    desc: "Modern, animated portfolio with Doctor Strange portal effects and responsive design.",
    tags: ["React", "Framer Motion", "Tailwind"],
    emoji: "🚀",
  },
];

export const ProjectsSection = () => (
  <section id="projects" className="py-24 px-6 relative">
    {/* Background grid pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(hsl(var(--neon-purple)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple)) 1px, transparent 1px)`,
      backgroundSize: "50px 50px",
    }} />

    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-wider">
          <span className="text-primary">🚀</span> Projects
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mb-10 rounded-full" />
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            className="rounded-xl border border-border bg-card p-6 card-glow hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent" />
            
            <div className="text-3xl mb-3">{p.emoji}</div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem' }}>
              {p.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{p.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {p.tags.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                ))}
              </div>
              <div className="flex gap-3 text-muted-foreground">
                <Github className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                <ExternalLink className="w-4 h-4 hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

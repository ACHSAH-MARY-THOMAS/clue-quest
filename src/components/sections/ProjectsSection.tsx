import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-stack web app with React, Node.js, and MongoDB. Features auth, payments, and real-time inventory.",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "AI Chat Assistant",
    desc: "Python-based chatbot using NLP for customer support automation with 95% accuracy.",
    tags: ["Python", "NLP", "Flask"],
  },
  {
    title: "Task Management App",
    desc: "Collaborative project management tool with real-time updates and team features.",
    tags: ["TypeScript", "React", "PostgreSQL"],
  },
  {
    title: "Portfolio Website",
    desc: "Modern, animated portfolio with portal effects and responsive design.",
    tags: ["React", "Framer Motion", "Tailwind"],
  },
];

export const ProjectsSection = () => (
  <section id="projects" className="py-24 px-6 bg-card/50">
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Projects</h2>
        <div className="w-16 h-1 bg-primary mb-10 rounded-full" />
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{p.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {p.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="flex gap-2 text-muted-foreground">
                <Github className="w-4 h-4 hover:text-foreground cursor-pointer transition-colors" />
                <ExternalLink className="w-4 h-4 hover:text-foreground cursor-pointer transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

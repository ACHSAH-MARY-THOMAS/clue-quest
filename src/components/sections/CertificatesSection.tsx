import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";

const certificates = [
  { title: "B.Tech in Computer Science", org: "University Name", type: "education", year: "2024", icon: "📚" },
  { title: "AWS Cloud Practitioner", org: "Amazon Web Services", type: "education", year: "2023", icon: "☁️" },
  { title: "Full Stack Web Development", org: "Coursera", type: "education", year: "2023", icon: "🎓" },
  { title: "Hackathon Winner - CodeFest", org: "Tech Community", type: "extra", year: "2023", icon: "🏆" },
  { title: "Best Paper Award", org: "IEEE Conference", type: "extra", year: "2022", icon: "📄" },
  { title: "Sports Captain - Cricket", org: "University", type: "extra", year: "2022", icon: "🏏" },
];

export const CertificatesSection = () => (
  <section id="certificates" className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-wider">
          <span className="text-primary">🏅</span> Certificates & Achievements
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mb-10 rounded-full" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.title}
            className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card card-glow hover:border-primary/40 transition-all duration-300"
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${
              cert.type === "education" ? "bg-primary/15" : "bg-accent/15"
            }`}>
              {cert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm tracking-wide">{cert.title}</h3>
              <p className="text-xs text-muted-foreground">{cert.org}</p>
            </div>
            <span className="text-xs text-primary font-mono font-bold">{cert.year}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

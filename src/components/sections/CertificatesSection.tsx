import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";

const certificates = [
  { title: "B.Tech in Computer Science", org: "University Name", type: "education", year: "2024" },
  { title: "AWS Cloud Practitioner", org: "Amazon Web Services", type: "education", year: "2023" },
  { title: "Full Stack Web Development", org: "Coursera", type: "education", year: "2023" },
  { title: "Hackathon Winner - CodeFest", org: "Tech Community", type: "extra", year: "2023" },
  { title: "Best Paper Award", org: "IEEE Conference", type: "extra", year: "2022" },
  { title: "Sports Captain - Cricket", org: "University", type: "extra", year: "2022" },
];

export const CertificatesSection = () => (
  <section id="certificates" className="py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Certificates & Achievements</h2>
        <div className="w-16 h-1 bg-primary mb-10 rounded-full" />
      </motion.div>

      <div className="grid gap-4">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.title}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              cert.type === "education" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
            }`}>
              {cert.type === "education" ? <GraduationCap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.org}</p>
            </div>
            <span className="text-sm text-muted-foreground">{cert.year}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

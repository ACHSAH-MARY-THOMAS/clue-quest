import { motion } from "framer-motion";

/** Reusable cyberpunk HUD frame wrapper */
export const CyberFrame = ({
  children,
  className = "",
  glowColor = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "primary" | "accent";
}) => {
  const colorVar = glowColor === "accent" ? "--accent" : "--primary";
  return (
    <div className={`relative ${className}`}>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/60" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/60" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/60" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/60" />
      {/* Top bar accent */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {/* Bottom bar accent */}
      <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {children}
    </div>
  );
};

/** Small decorative dot with pulse */
export const HudDot = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
    <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary/30 blur-sm" />
  </div>
);

/** Section header with cyberpunk styling */
export const CyberSectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mb-10"
  >
    <div className="flex items-center gap-3 mb-3">
      <HudDot />
      <div className="h-[1px] w-8 bg-primary/50" />
      <span className="text-primary text-xs tracking-[0.4em] uppercase font-mono">
        {subtitle || "System.module"}
      </span>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-wider">
      <span className="text-primary">{icon}</span> {title}
    </h2>
    <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mt-3 rounded-full" />
  </motion.div>
);

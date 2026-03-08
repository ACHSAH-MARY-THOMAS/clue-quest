import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const techIcons = [
  { label: "PY", color: "hsl(200, 80%, 55%)" },
  { label: "JS", color: "hsl(50, 100%, 50%)" },
  { label: "⚛", color: "hsl(200, 100%, 60%)" },
  { label: "TS", color: "hsl(210, 80%, 55%)" },
  { label: "🟢", color: "hsl(120, 60%, 50%)" },
  { label: "</>", color: "hsl(15, 90%, 55%)" },
  { label: "☕", color: "hsl(25, 80%, 50%)" },
  { label: "🐍", color: "hsl(140, 60%, 50%)" },
];

const Spark = ({ index, total, radius, isHovered }: { index: number; total: number; radius: number; isHovered: boolean }) => {
  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 3 + Math.random() * 3,
        height: 3 + Math.random() * 3,
        left: "50%",
        top: "50%",
        background: `hsl(${30 + Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`,
      }}
      animate={isHovered ? {
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      } : { x: 0, y: 0, opacity: 0, scale: 0 }}
      transition={{
        duration: 1 + Math.random() * 1.5,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeOut",
      }}
    />
  );
};

export const PortalPhoto = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const orbitRadius = 155;

  return (
    <div
      className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer portal ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from ${rotation}deg, 
            hsl(var(--portal-inner) / 0) 0%, 
            hsl(var(--portal-outer)) 15%, 
            hsl(var(--glow-primary)) 30%, 
            hsl(var(--portal-inner) / 0) 50%, 
            hsl(var(--portal-outer)) 65%, 
            hsl(var(--glow-primary)) 80%, 
            hsl(var(--portal-inner) / 0) 100%)`,
        }}
        animate={{ 
          opacity: isHovered ? 1 : 0.5,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Inner dark circle */}
      <div className="absolute inset-[12px] md:inset-[14px] rounded-full bg-background" />

      {/* Second ring */}
      <motion.div
        className="absolute inset-[6px] md:inset-[7px] rounded-full"
        style={{
          background: `conic-gradient(from ${rotation + 180}deg, 
            transparent 0%, 
            hsl(var(--portal-outer) / 0.6) 20%, 
            transparent 40%,
            hsl(var(--glow-primary) / 0.5) 60%,
            transparent 80%)`,
        }}
        animate={{ opacity: isHovered ? 0.9 : 0.3 }}
      />

      {/* Inner dark */}
      <div className="absolute inset-[18px] md:inset-[22px] rounded-full bg-background" />

      {/* Photo placeholder */}
      <div className="absolute inset-[24px] md:inset-[28px] rounded-full overflow-hidden border-2 border-primary/30 bg-muted flex items-center justify-center">
        <span className="text-5xl md:text-6xl text-muted-foreground">👤</span>
      </div>

      {/* Spark particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Spark key={i} index={i} total={40} radius={140 + Math.random() * 40} isHovered={isHovered} />
      ))}

      {/* Orbiting tech icons */}
      <AnimatePresence>
        {isHovered && techIcons.map((icon, i) => {
          const angle = (i / techIcons.length) * Math.PI * 2 + rotation * (Math.PI / 180) * 0.3;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;

          return (
            <motion.div
              key={icon.label}
              className="absolute w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border border-primary/40 backdrop-blur-sm"
              style={{
                left: "50%",
                top: "50%",
                background: `hsl(var(--card))`,
                color: icon.color,
                boxShadow: `0 0 12px ${icon.color}40`,
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x: x - 18, y: y - 18, opacity: 1, scale: 1 }}
              exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, type: "spring", stiffness: 200 }}
            >
              {icon.label}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isHovered
            ? "0 0 40px hsl(35 100% 55% / 0.5), 0 0 80px hsl(35 100% 55% / 0.25), 0 0 120px hsl(35 100% 55% / 0.1)"
            : "0 0 20px hsl(35 100% 55% / 0.15)",
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const techIcons = [
  { label: "PY", color: "hsl(50, 100%, 55%)" },
  { label: "JS", color: "hsl(50, 100%, 50%)" },
  { label: "⚛", color: "hsl(200, 100%, 60%)" },
  { label: "TS", color: "hsl(210, 80%, 55%)" },
  { label: "🟢", color: "hsl(120, 60%, 50%)" },
  { label: "</>", color: "hsl(15, 90%, 55%)" },
  { label: "☕", color: "hsl(25, 80%, 50%)" },
  { label: "🐍", color: "hsl(140, 60%, 50%)" },
];

// Fire spark particle using canvas for realism
const FireCanvas = ({ isHovered, size }: { isHovered: boolean; size: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    life: number; maxLife: number; size: number;
    hue: number; brightness: number;
  }>>([]);
  const animFrame = useRef<number>(0);

  const spawnParticle = useCallback((cx: number, cy: number, radius: number) => {
    const angle = Math.random() * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * 12;
    const speed = 0.3 + Math.random() * 1.5;
    const tangent = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      vx: Math.cos(tangent) * speed + (Math.random() - 0.5) * 0.5,
      vy: Math.sin(tangent) * speed - Math.random() * 1.2,
      life: 0,
      maxLife: 30 + Math.random() * 40,
      size: 1 + Math.random() * 3,
      hue: 15 + Math.random() * 30,
      brightness: 50 + Math.random() * 50,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    const ringRadius = size * 0.38;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      if (isHovered) {
        for (let i = 0; i < 6; i++) {
          particles.current.push(spawnParticle(cx, cy, ringRadius));
        }
      } else if (particles.current.length > 0) {
        // let existing particles die out
      }

      // Draw ring glow
      if (isHovered) {
        const gradient = ctx.createRadialGradient(cx, cy, ringRadius - 20, cx, cy, ringRadius + 30);
        gradient.addColorStop(0, "hsla(25, 100%, 50%, 0)");
        gradient.addColorStop(0.4, "hsla(30, 100%, 55%, 0.15)");
        gradient.addColorStop(0.7, "hsla(35, 100%, 50%, 0.08)");
        gradient.addColorStop(1, "hsla(25, 100%, 50%, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }

      // Update and draw particles
      particles.current = particles.current.filter(p => {
        p.life++;
        if (p.life > p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // slight upward drift

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.2 ? progress * 5 : 1 - (progress - 0.2) / 0.8;
        const currentSize = p.size * (1 - progress * 0.5);

        // Core bright particle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 3);
        grad.addColorStop(0, `hsla(${p.hue + 20}, 100%, 95%, ${alpha})`);
        grad.addColorStop(0.3, `hsla(${p.hue}, 100%, ${p.brightness}%, ${alpha * 0.8})`);
        grad.addColorStop(0.7, `hsla(${p.hue - 10}, 100%, 40%, ${alpha * 0.3})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 30%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animFrame.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animFrame.current);
  }, [isHovered, size, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
};

export const PortalPhoto = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const size = 380;
  const orbitRadius = 160;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.4);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fire ring canvas */}
      <FireCanvas isHovered={isHovered} size={size} />

      {/* Outer portal ring - gradient ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 10,
          background: `conic-gradient(from ${rotation}deg, 
            transparent 0%, 
            hsl(25, 100%, 50%) 8%, 
            hsl(35, 100%, 60%) 15%, 
            hsl(40, 100%, 65%) 20%, 
            transparent 30%, 
            hsl(20, 100%, 45%) 45%, 
            hsl(30, 100%, 55%) 55%, 
            hsl(40, 100%, 60%) 60%, 
            transparent 70%,
            hsl(25, 100%, 50%) 80%,
            hsl(35, 100%, 58%) 90%,
            transparent 100%)`,
          filter: "blur(2px)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0.3,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Glow layer */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 6,
          background: `conic-gradient(from ${rotation + 120}deg, 
            transparent 0%,
            hsl(30, 100%, 55% / 0.4) 15%,
            transparent 30%,
            hsl(25, 100%, 50% / 0.3) 50%,
            transparent 65%,
            hsl(35, 100%, 60% / 0.35) 80%,
            transparent 100%)`,
          filter: "blur(6px)",
        }}
        animate={{ opacity: isHovered ? 0.9 : 0.15 }}
      />

      {/* Dark inner disc */}
      <div
        className="absolute rounded-full bg-background"
        style={{ inset: 20 }}
      />

      {/* Thin bright inner ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 18,
          border: "1px solid hsl(35, 100%, 55% / 0.4)",
        }}
        animate={{
          borderColor: isHovered
            ? "hsl(35, 100%, 60% / 0.8)"
            : "hsl(35, 100%, 55% / 0.2)",
        }}
      />

      {/* Photo placeholder */}
      <div
        className="absolute rounded-full overflow-hidden bg-muted flex items-center justify-center"
        style={{
          inset: 28,
          border: "2px solid hsl(35, 100%, 55% / 0.3)",
        }}
      >
        <span className="text-6xl text-muted-foreground select-none">👤</span>
      </div>

      {/* Orbiting tech icons */}
      <AnimatePresence>
        {isHovered && techIcons.map((icon, i) => {
          const angle = (i / techIcons.length) * Math.PI * 2 + rotation * (Math.PI / 180) * 0.25;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;

          return (
            <motion.div
              key={icon.label}
              className="absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-md z-20"
              style={{
                left: "50%",
                top: "50%",
                background: "hsl(222 47% 9% / 0.85)",
                color: icon.color,
                border: `1px solid ${icon.color}50`,
                boxShadow: `0 0 15px ${icon.color}30, 0 0 30px ${icon.color}15`,
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x: x - 20, y: y - 20, opacity: 1, scale: 1 }}
              exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, type: "spring", stiffness: 180 }}
            >
              {icon.label}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Ambient outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? "0 0 50px hsl(30 100% 50% / 0.4), 0 0 100px hsl(25 100% 45% / 0.2), 0 0 150px hsl(35 100% 55% / 0.1)"
            : "0 0 20px hsl(30 100% 50% / 0.1)",
        }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
};

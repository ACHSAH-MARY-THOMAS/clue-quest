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

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; hue: number;
  brightness: number; type: "ember" | "spark" | "flame" | "trail";
  angle: number; speed: number;
}

const FirePortalCanvas = ({ isHovered, size }: { isHovered: boolean; size: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animFrame = useRef(0);
  const hoverProgress = useRef(0);
  const time = useRef(0);

  const cx = size / 2;
  const cy = size / 2;
  const ringRadius = size * 0.39;
  const ringThickness = size * 0.06;

  const spawn = useCallback(() => {
    const angle = Math.random() * Math.PI * 2;
    const rOff = (Math.random() - 0.5) * ringThickness;
    const r = ringRadius + rOff;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    // Tangential + outward velocity
    const tangent = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    const outward = angle + (Math.random() - 0.5) * 1.2;
    const speed = 0.4 + Math.random() * 1.8;

    const types: Particle["type"][] = ["ember", "spark", "flame", "trail"];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      x, y,
      vx: Math.cos(tangent) * speed * 0.5 + Math.cos(outward) * speed * 0.8,
      vy: Math.sin(tangent) * speed * 0.5 + Math.sin(outward) * speed * 0.8 - Math.random() * 0.8,
      life: 0,
      maxLife: type === "trail" ? 50 + Math.random() * 30 : type === "flame" ? 25 + Math.random() * 20 : 15 + Math.random() * 25,
      size: type === "spark" ? 0.5 + Math.random() * 1.5 : type === "flame" ? 3 + Math.random() * 5 : 1 + Math.random() * 3,
      hue: 10 + Math.random() * 35,
      brightness: 50 + Math.random() * 50,
      type,
      angle,
      speed,
    } as Particle;
  }, [cx, cy, ringRadius, ringThickness]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const animate = () => {
      time.current += 0.016;
      // Smooth hover transition
      const target = isHovered ? 1 : 0;
      hoverProgress.current += (target - hoverProgress.current) * 0.05;
      const hp = hoverProgress.current;

      ctx.clearRect(0, 0, size, size);

      if (hp > 0.01) {
        const spawnCount = Math.floor(hp * 18);
        for (let i = 0; i < spawnCount; i++) {
          particles.current.push(spawn());
        }

        // --- Draw the glowing ring base ---
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Outer soft glow
        for (let layer = 0; layer < 3; layer++) {
          const blur = 15 + layer * 12;
          const alpha = (0.12 - layer * 0.03) * hp;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(30, 100%, 55%, ${alpha})`;
          ctx.lineWidth = ringThickness + blur;
          ctx.filter = `blur(${blur}px)`;
          ctx.stroke();
        }

        // Core bright ring with rotation
        ctx.filter = "blur(2px)";
        const segments = 120;
        for (let s = 0; s < segments; s++) {
          const a1 = (s / segments) * Math.PI * 2;
          const a2 = ((s + 1.5) / segments) * Math.PI * 2;
          // Vary brightness around the ring
          const noise = Math.sin(a1 * 3 + time.current * 2) * 0.3 + Math.sin(a1 * 7 + time.current * 4) * 0.15;
          const bright = 0.5 + noise * 0.5;
          const hue = 25 + Math.sin(a1 * 2 + time.current) * 10;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, a1, a2);
          ctx.strokeStyle = `hsla(${hue}, 100%, ${55 + bright * 30}%, ${(0.6 + bright * 0.4) * hp})`;
          ctx.lineWidth = ringThickness * (0.6 + bright * 0.5);
          ctx.stroke();
        }

        // Inner white-hot ring
        ctx.filter = "blur(1px)";
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(40, 100%, 85%, ${0.3 * hp})`;
        ctx.lineWidth = ringThickness * 0.25;
        ctx.stroke();

        ctx.filter = "none";
        ctx.restore();

        // --- Draw particles ---
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        particles.current = particles.current.filter(p => {
          p.life++;
          if (p.life > p.maxLife) return false;

          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.015;
          // Slow down
          p.vx *= 0.99;
          p.vy *= 0.99;

          const progress = p.life / p.maxLife;
          const fadeIn = Math.min(progress * 8, 1);
          const fadeOut = 1 - Math.pow(progress, 1.5);
          const alpha = fadeIn * fadeOut * hp;

          if (p.type === "flame") {
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            grad.addColorStop(0, `hsla(${p.hue + 15}, 100%, 90%, ${alpha})`);
            grad.addColorStop(0.2, `hsla(${p.hue}, 100%, 65%, ${alpha * 0.8})`);
            grad.addColorStop(0.5, `hsla(${p.hue - 5}, 100%, 45%, ${alpha * 0.4})`);
            grad.addColorStop(1, `hsla(${p.hue - 10}, 100%, 25%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === "spark") {
            // Bright tiny dot
            ctx.fillStyle = `hsla(${p.hue + 20}, 100%, 95%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            // Tiny glow
            const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            sg.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha * 0.5})`);
            sg.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
            ctx.fillStyle = sg;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === "trail") {
            const tSize = p.size * (1 - progress * 0.7);
            const tg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, tSize * 3);
            tg.addColorStop(0, `hsla(${p.hue + 10}, 100%, 80%, ${alpha * 0.6})`);
            tg.addColorStop(0.5, `hsla(${p.hue}, 90%, 50%, ${alpha * 0.3})`);
            tg.addColorStop(1, `hsla(${p.hue - 10}, 80%, 30%, 0)`);
            ctx.fillStyle = tg;
            ctx.beginPath();
            ctx.arc(p.x, p.y, tSize * 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // ember
            const eSize = p.size * (1 - progress * 0.5);
            const eg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, eSize * 2.5);
            eg.addColorStop(0, `hsla(${p.hue + 15}, 100%, 90%, ${alpha})`);
            eg.addColorStop(0.4, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.7})`);
            eg.addColorStop(1, `hsla(${p.hue - 5}, 100%, 35%, 0)`);
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(p.x, p.y, eSize * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          return true;
        });

        ctx.restore();
      }

      animFrame.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animFrame.current);
  }, [isHovered, size, spawn, cx, cy, ringRadius, ringThickness]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export const PortalPhoto = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const size = 380;
  const orbitRadius = 165;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.3);
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
      <FirePortalCanvas isHovered={isHovered} size={size} />

      {/* Dark inner circle to mask the ring center */}
      <div
        className="absolute rounded-full bg-background z-[5]"
        style={{ inset: size * 0.12 }}
      />

      {/* Photo placeholder */}
      <div
        className="absolute rounded-full overflow-hidden bg-muted flex items-center justify-center z-[6]"
        style={{
          inset: size * 0.14,
          border: "2px solid hsl(35, 100%, 55% / 0.25)",
        }}
      >
        <span className="text-6xl text-muted-foreground select-none">👤</span>
      </div>

      {/* Subtle ambient glow (always visible) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ inset: -10 }}
        animate={{
          boxShadow: isHovered
            ? "0 0 60px hsl(30 100% 50% / 0.35), 0 0 120px hsl(25 100% 45% / 0.15)"
            : "0 0 15px hsl(30 100% 50% / 0.08)",
        }}
        transition={{ duration: 0.8 }}
      />

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
                background: "hsl(222 47% 9% / 0.9)",
                color: icon.color,
                border: `1px solid ${icon.color}40`,
                boxShadow: `0 0 12px ${icon.color}25, 0 0 25px ${icon.color}10`,
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
    </div>
  );
};

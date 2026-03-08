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

interface Spark {
  angle: number;
  radius: number;
  speed: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  sat: number;
  light: number;
  drift: number;
  curl: number;
  type: "spark" | "ember" | "streamer";
}

const FirePortalCanvas = ({ isHovered, size }: { isHovered: boolean; size: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const animFrame = useRef(0);
  const hoverProgress = useRef(0);
  const time = useRef(0);

  const cx = size / 2;
  const cy = size / 2;
  const ringRadius = size * 0.36;

  const spawnSpark = useCallback((): Spark => {
    const angle = Math.random() * Math.PI * 2;
    const type: Spark["type"] = Math.random() < 0.15 ? "streamer" : Math.random() < 0.4 ? "ember" : "spark";
    
    return {
      angle,
      radius: ringRadius + (Math.random() - 0.5) * size * 0.04,
      speed: type === "streamer" 
        ? 1.5 + Math.random() * 3.5 
        : type === "spark" 
          ? 0.8 + Math.random() * 2.5 
          : 0.3 + Math.random() * 1.2,
      life: 0,
      maxLife: type === "streamer" 
        ? 30 + Math.random() * 40 
        : type === "spark" 
          ? 15 + Math.random() * 25 
          : 40 + Math.random() * 30,
      size: type === "streamer" ? 1 + Math.random() * 1.5 : type === "spark" ? 0.5 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
      hue: 15 + Math.random() * 30,
      sat: 90 + Math.random() * 10,
      light: type === "streamer" ? 70 + Math.random() * 25 : 50 + Math.random() * 40,
      drift: (Math.random() - 0.5) * 0.04,
      curl: (Math.random() - 0.5) * 0.02,
      type,
    };
  }, [ringRadius, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const animate = () => {
      time.current += 0.016;
      const target = isHovered ? 1 : 0;
      hoverProgress.current += (target - hoverProgress.current) * 0.06;
      const hp = hoverProgress.current;

      ctx.clearRect(0, 0, size, size);

      if (hp > 0.005) {
        // Spawn sparks - lots of them for density
        const spawnCount = Math.floor(hp * 35);
        for (let i = 0; i < spawnCount; i++) {
          sparks.current.push(spawnSpark());
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // === CORE RING GLOW (multiple soft layers) ===
        for (let layer = 0; layer < 5; layer++) {
          const blur = 8 + layer * 10;
          const alpha = (0.15 - layer * 0.025) * hp;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(30, 100%, 55%, ${alpha})`;
          ctx.lineWidth = size * 0.05 + blur;
          ctx.filter = `blur(${blur}px)`;
          ctx.stroke();
        }

        // === BRIGHT CORE RING with animated variation ===
        ctx.filter = "blur(3px)";
        const segments = 180;
        for (let s = 0; s < segments; s++) {
          const a1 = (s / segments) * Math.PI * 2;
          const a2 = ((s + 1.5) / segments) * Math.PI * 2;
          const noise = 
            Math.sin(a1 * 4 + time.current * 3) * 0.25 + 
            Math.sin(a1 * 9 + time.current * 5) * 0.15 +
            Math.sin(a1 * 15 + time.current * 7) * 0.1;
          const bright = 0.5 + noise;
          const hue = 25 + Math.sin(a1 * 3 + time.current * 2) * 12;
          const width = size * 0.035 * (0.5 + bright * 0.6);
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, a1, a2);
          ctx.strokeStyle = `hsla(${hue}, 100%, ${50 + bright * 40}%, ${(0.7 + bright * 0.3) * hp})`;
          ctx.lineWidth = width;
          ctx.stroke();
        }

        // === WHITE-HOT inner edge ===
        ctx.filter = "blur(1.5px)";
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(45, 100%, 92%, ${0.4 * hp})`;
        ctx.lineWidth = size * 0.012;
        ctx.stroke();

        ctx.filter = "none";

        // === SPARKS & EMBERS ===
        sparks.current = sparks.current.filter(s => {
          s.life++;
          if (s.life > s.maxLife) return false;

          const progress = s.life / s.maxLife;
          s.angle += s.drift + s.curl * Math.sin(s.life * 0.1);
          s.radius += s.speed;

          const x = cx + Math.cos(s.angle) * s.radius;
          const y = cy + Math.sin(s.angle) * s.radius;

          // Out of bounds check
          if (x < -10 || x > size + 10 || y < -10 || y > size + 10) return false;

          const fadeIn = Math.min(progress * 6, 1);
          const fadeOut = Math.pow(1 - progress, 1.8);
          const alpha = fadeIn * fadeOut * hp;

          if (s.type === "streamer") {
            // Long bright streaks shooting outward
            const tailLen = s.speed * 4;
            const tx = cx + Math.cos(s.angle) * (s.radius - tailLen);
            const ty = cy + Math.sin(s.angle) * (s.radius - tailLen);
            
            const grad = ctx.createLinearGradient(tx, ty, x, y);
            grad.addColorStop(0, `hsla(${s.hue}, ${s.sat}%, ${s.light}%, 0)`);
            grad.addColorStop(0.3, `hsla(${s.hue}, ${s.sat}%, ${s.light}%, ${alpha * 0.5})`);
            grad.addColorStop(1, `hsla(${s.hue + 10}, 100%, ${Math.min(s.light + 20, 95)}%, ${alpha})`);
            
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(x, y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.size * (1 - progress * 0.5);
            ctx.stroke();

            // Bright tip
            const tipGrad = ctx.createRadialGradient(x, y, 0, x, y, s.size * 3);
            tipGrad.addColorStop(0, `hsla(${s.hue + 15}, 100%, 95%, ${alpha})`);
            tipGrad.addColorStop(0.5, `hsla(${s.hue}, 100%, 70%, ${alpha * 0.4})`);
            tipGrad.addColorStop(1, `hsla(${s.hue - 5}, 100%, 40%, 0)`);
            ctx.fillStyle = tipGrad;
            ctx.beginPath();
            ctx.arc(x, y, s.size * 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (s.type === "spark") {
            // Small bright dots
            ctx.fillStyle = `hsla(${s.hue + 15}, 100%, ${s.light + 10}%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, s.size * (1 - progress * 0.4), 0, Math.PI * 2);
            ctx.fill();

            // Glow around spark
            const sg = ctx.createRadialGradient(x, y, 0, x, y, s.size * 5);
            sg.addColorStop(0, `hsla(${s.hue}, 100%, 65%, ${alpha * 0.3})`);
            sg.addColorStop(1, `hsla(${s.hue}, 100%, 40%, 0)`);
            ctx.fillStyle = sg;
            ctx.beginPath();
            ctx.arc(x, y, s.size * 5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Embers - larger, softer, slower
            const eSize = s.size * (1 - progress * 0.3);
            const eg = ctx.createRadialGradient(x, y, 0, x, y, eSize * 4);
            eg.addColorStop(0, `hsla(${s.hue + 10}, 100%, 85%, ${alpha * 0.8})`);
            eg.addColorStop(0.3, `hsla(${s.hue}, 100%, 55%, ${alpha * 0.5})`);
            eg.addColorStop(0.7, `hsla(${s.hue - 10}, 90%, 35%, ${alpha * 0.2})`);
            eg.addColorStop(1, `hsla(${s.hue - 15}, 80%, 20%, 0)`);
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(x, y, eSize * 4, 0, Math.PI * 2);
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
  }, [isHovered, size, spawnSpark, cx, cy, ringRadius]);

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
      <FirePortalCanvas isHovered={isHovered} size={size} />

      {/* Dark inner circle */}
      <div
        className="absolute rounded-full bg-background z-[5]"
        style={{ inset: size * 0.15 }}
      />

      {/* Photo placeholder */}
      <div
        className="absolute rounded-full overflow-hidden bg-muted flex items-center justify-center z-[6]"
        style={{
          inset: size * 0.17,
          border: "2px solid hsl(35, 100%, 55% / 0.25)",
        }}
      >
        <span className="text-6xl text-muted-foreground select-none">👤</span>
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ inset: -10 }}
        animate={{
          boxShadow: isHovered
            ? "0 0 80px hsl(30 100% 50% / 0.4), 0 0 160px hsl(25 100% 45% / 0.2)"
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

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
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  light: number;
  type: "streak" | "dot" | "glow";
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
    const r = ringRadius + (Math.random() - 0.5) * size * 0.03;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    // Purely radial outward direction with slight random spread
    const spreadAngle = angle + (Math.random() - 0.5) * 0.6;
    const speed = 1.5 + Math.random() * 4;
    const type: Spark["type"] = Math.random() < 0.2 ? "glow" : Math.random() < 0.5 ? "streak" : "dot";

    return {
      x, y,
      vx: Math.cos(spreadAngle) * speed,
      vy: Math.sin(spreadAngle) * speed,
      life: 0,
      maxLife: type === "streak" ? 20 + Math.random() * 30 : type === "glow" ? 30 + Math.random() * 20 : 10 + Math.random() * 20,
      size: type === "streak" ? 1 + Math.random() * 1.5 : type === "glow" ? 3 + Math.random() * 4 : 0.5 + Math.random() * 1.5,
      hue: 15 + Math.random() * 30,
      light: type === "streak" ? 75 + Math.random() * 20 : 50 + Math.random() * 35,
      type,
    };
  }, [cx, cy, ringRadius, size]);

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
        // Spawn lots of sparks
        const spawnCount = Math.floor(hp * 40);
        for (let i = 0; i < spawnCount; i++) {
          sparks.current.push(spawnSpark());
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // === SOFT AMBIENT GLOW layers ===
        for (let layer = 0; layer < 4; layer++) {
          const blur = 12 + layer * 14;
          const alpha = (0.12 - layer * 0.02) * hp;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(28, 100%, 50%, ${alpha})`;
          ctx.lineWidth = size * 0.06 + blur;
          ctx.filter = `blur(${blur}px)`;
          ctx.stroke();
        }

        // === BRIGHT CORE RING ===
        ctx.filter = "blur(2px)";
        const segments = 200;
        for (let s = 0; s < segments; s++) {
          const a1 = (s / segments) * Math.PI * 2;
          const a2 = ((s + 1.5) / segments) * Math.PI * 2;
          const noise =
            Math.sin(a1 * 5 + time.current * 3) * 0.2 +
            Math.sin(a1 * 11 + time.current * 6) * 0.15 +
            Math.sin(a1 * 19 + time.current * 9) * 0.08;
          const bright = 0.55 + noise;
          const hue = 25 + Math.sin(a1 * 3 + time.current * 1.5) * 10;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, a1, a2);
          ctx.strokeStyle = `hsla(${hue}, 100%, ${50 + bright * 40}%, ${(0.6 + bright * 0.4) * hp})`;
          ctx.lineWidth = size * 0.03 * (0.5 + bright * 0.6);
          ctx.stroke();
        }

        // === WHITE-HOT inner edge ===
        ctx.filter = "blur(1px)";
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(45, 100%, 92%, ${0.35 * hp})`;
        ctx.lineWidth = size * 0.008;
        ctx.stroke();

        ctx.filter = "none";

        // === SPARKS shooting outward radially ===
        sparks.current = sparks.current.filter(s => {
          s.life++;
          if (s.life > s.maxLife) return false;

          // Move outward — NO rotation, pure radial spread
          s.x += s.vx;
          s.y += s.vy;
          // Slight deceleration
          s.vx *= 0.985;
          s.vy *= 0.985;

          if (s.x < -20 || s.x > size + 20 || s.y < -20 || s.y > size + 20) return false;

          const progress = s.life / s.maxLife;
          const fadeIn = Math.min(progress * 8, 1);
          const fadeOut = Math.pow(1 - progress, 2);
          const alpha = fadeIn * fadeOut * hp;

          if (s.type === "streak") {
            // Draw a line from previous position to current (streak tail)
            const tailLen = Math.sqrt(s.vx * s.vx + s.vy * s.vy) * 5;
            const angle = Math.atan2(s.vy, s.vx);
            const tx = s.x - Math.cos(angle) * tailLen;
            const ty = s.y - Math.sin(angle) * tailLen;

            const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
            grad.addColorStop(0, `hsla(${s.hue}, 100%, ${s.light}%, 0)`);
            grad.addColorStop(0.4, `hsla(${s.hue}, 100%, ${s.light}%, ${alpha * 0.4})`);
            grad.addColorStop(1, `hsla(${s.hue + 10}, 100%, ${Math.min(s.light + 15, 97)}%, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.size * (1 - progress * 0.5);
            ctx.stroke();

            // Bright tip dot
            ctx.fillStyle = `hsla(${s.hue + 15}, 100%, 95%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          } else if (s.type === "dot") {
            // Tiny bright particles
            ctx.fillStyle = `hsla(${s.hue + 10}, 100%, ${s.light + 15}%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * (1 - progress * 0.3), 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Soft glow embers
            const eSize = s.size * (1 - progress * 0.4);
            const eRadius = eSize * 4;
            if (!Number.isFinite(s.x) || !Number.isFinite(s.y) || !Number.isFinite(eRadius) || eRadius <= 0) return true;
            const eg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, eRadius);
            eg.addColorStop(0, `hsla(${s.hue + 10}, 100%, 85%, ${alpha * 0.7})`);
            eg.addColorStop(0.3, `hsla(${s.hue}, 100%, 55%, ${alpha * 0.4})`);
            eg.addColorStop(1, `hsla(${s.hue - 10}, 90%, 30%, 0)`);
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(s.x, s.y, eSize * 4, 0, Math.PI * 2);
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

      <div className="absolute rounded-full bg-background z-[5]" style={{ inset: size * 0.15 }} />

      <div
        className="absolute rounded-full overflow-hidden bg-muted flex items-center justify-center z-[6]"
        style={{ inset: size * 0.17, border: "2px solid hsl(35, 100%, 55% / 0.25)" }}
      >
        <span className="text-6xl text-muted-foreground select-none">👤</span>
      </div>

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
                left: "50%", top: "50%",
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

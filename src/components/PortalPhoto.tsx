import { useState, useEffect, useRef } from "react";
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
}

const MandalaCanvas = ({ isHovered, size }: { isHovered: boolean; size: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const animFrame = useRef(0);
  const hoverProgress = useRef(0);
  const time = useRef(0);

  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const drawPolygon = (
      x: number, y: number, radius: number, sides: number,
      rotation: number, lineWidth: number, color: string
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const a = (i / sides) * Math.PI * 2 + rotation;
        const px = x + Math.cos(a) * radius;
        const py = y + Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const drawRunes = (
      radius: number, count: number, rotation: number,
      alpha: number, runeSize: number
    ) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rotation;
        const rx = cx + Math.cos(a) * radius;
        const ry = cy + Math.sin(a) * radius;

        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(a + Math.PI / 2);

        // Draw small mystical marks
        const runeType = i % 4;
        ctx.strokeStyle = `hsla(35, 100%, 70%, ${alpha})`;
        ctx.lineWidth = 1;

        if (runeType === 0) {
          // Small triangle
          ctx.beginPath();
          ctx.moveTo(0, -runeSize);
          ctx.lineTo(-runeSize * 0.7, runeSize * 0.5);
          ctx.lineTo(runeSize * 0.7, runeSize * 0.5);
          ctx.closePath();
          ctx.stroke();
        } else if (runeType === 1) {
          // Small circle with dot
          ctx.beginPath();
          ctx.arc(0, 0, runeSize * 0.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `hsla(35, 100%, 80%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (runeType === 2) {
          // Cross
          ctx.beginPath();
          ctx.moveTo(0, -runeSize * 0.6);
          ctx.lineTo(0, runeSize * 0.6);
          ctx.moveTo(-runeSize * 0.6, 0);
          ctx.lineTo(runeSize * 0.6, 0);
          ctx.stroke();
        } else {
          // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -runeSize * 0.6);
          ctx.lineTo(runeSize * 0.4, 0);
          ctx.lineTo(0, runeSize * 0.6);
          ctx.lineTo(-runeSize * 0.4, 0);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    const animate = () => {
      time.current += 0.016;
      const t = time.current;
      const target = isHovered ? 1 : 0;
      hoverProgress.current += (target - hoverProgress.current) * 0.06;
      const hp = hoverProgress.current;

      ctx.clearRect(0, 0, size, size);

      if (hp > 0.005) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const baseAlpha = hp;

        // === OUTER GLOW ===
        for (let layer = 0; layer < 3; layer++) {
          const blur = 8 + layer * 12;
          const r = size * 0.38 + layer * 4;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(30, 100%, 50%, ${(0.08 - layer * 0.02) * baseAlpha})`;
          ctx.lineWidth = 20 + layer * 10;
          ctx.filter = `blur(${blur}px)`;
          ctx.stroke();
        }
        ctx.filter = "none";

        // === RING 1: Outer ring (rotating clockwise) ===
        const r1 = size * 0.40;
        const rot1 = t * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r1, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(30, 100%, 55%, ${0.6 * baseAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tick marks on outer ring
        const tickCount = 60;
        for (let i = 0; i < tickCount; i++) {
          const a = (i / tickCount) * Math.PI * 2 + rot1;
          const len = i % 5 === 0 ? 8 : 4;
          const ix = cx + Math.cos(a) * r1;
          const iy = cy + Math.sin(a) * r1;
          const ox = cx + Math.cos(a) * (r1 + len);
          const oy = cy + Math.sin(a) * (r1 + len);
          ctx.beginPath();
          ctx.moveTo(ix, iy);
          ctx.lineTo(ox, oy);
          ctx.strokeStyle = `hsla(35, 100%, 65%, ${(i % 5 === 0 ? 0.7 : 0.35) * baseAlpha})`;
          ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.8;
          ctx.stroke();
        }

        // === RING 2: Second ring (rotating counter-clockwise) ===
        const r2 = size * 0.34;
        const rot2 = -t * 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(28, 100%, 60%, ${0.5 * baseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Runes on ring 2
        drawRunes(r2, 16, rot2, 0.6 * baseAlpha, 6);

        // === RING 3: Inner geometric ring (rotating clockwise faster) ===
        const r3 = size * 0.28;
        const rot3 = t * 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, r3, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(32, 100%, 55%, ${0.45 * baseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Runes on ring 3
        drawRunes(r3, 12, rot3 + 0.3, 0.5 * baseAlpha, 5);

        // === GEOMETRIC SHAPES ===

        // Outer hexagon
        drawPolygon(cx, cy, r1 * 0.92, 6, rot1 * 0.3,
          1.5, `hsla(30, 100%, 60%, ${0.4 * baseAlpha})`);

        // Inner triangle (rotating)
        drawPolygon(cx, cy, r3 * 0.85, 3, rot2 * 0.5 + Math.PI / 6,
          1.5, `hsla(35, 100%, 65%, ${0.5 * baseAlpha})`);

        // Inverted triangle
        drawPolygon(cx, cy, r3 * 0.85, 3, rot2 * 0.5 + Math.PI / 6 + Math.PI,
          1.5, `hsla(35, 100%, 65%, ${0.5 * baseAlpha})`);

        // Inner pentagon
        drawPolygon(cx, cy, r3 * 0.55, 5, rot3 * 0.8,
          1, `hsla(32, 100%, 60%, ${0.4 * baseAlpha})`);

        // Center star pattern
        const starR = size * 0.12;
        const starPoints = 8;
        ctx.beginPath();
        for (let i = 0; i < starPoints * 2; i++) {
          const a = (i / (starPoints * 2)) * Math.PI * 2 + rot1 * 1.2;
          const sr = i % 2 === 0 ? starR : starR * 0.45;
          const sx = cx + Math.cos(a) * sr;
          const sy = cy + Math.sin(a) * sr;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(35, 100%, 70%, ${0.45 * baseAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // === CONNECTING LINES between rings ===
        const connectors = 8;
        for (let i = 0; i < connectors; i++) {
          const a = (i / connectors) * Math.PI * 2 + rot1 * 0.2;
          const pulse = 0.5 + 0.5 * Math.sin(a * 3 + t * 2);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * r3, cy + Math.sin(a) * r3);
          ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
          ctx.strokeStyle = `hsla(30, 100%, 60%, ${0.15 * pulse * baseAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // === BRIGHT CORE RING (like the image's intense ring) ===
        ctx.filter = "blur(3px)";
        const coreR = size * 0.36;
        const segments = 180;
        for (let s = 0; s < segments; s++) {
          const a1 = (s / segments) * Math.PI * 2;
          const a2 = ((s + 1.5) / segments) * Math.PI * 2;
          const noise =
            Math.sin(a1 * 5 + t * 3) * 0.25 +
            Math.sin(a1 * 11 + t * 7) * 0.15;
          const bright = 0.5 + noise;
          ctx.beginPath();
          ctx.arc(cx, cy, coreR, a1, a2);
          ctx.strokeStyle = `hsla(30, 100%, ${55 + bright * 35}%, ${(0.5 + bright * 0.5) * baseAlpha})`;
          ctx.lineWidth = size * 0.02 * (0.6 + bright * 0.4);
          ctx.stroke();
        }
        ctx.filter = "none";

        // White-hot inner edge
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(40, 100%, 90%, ${0.3 * baseAlpha})`;
        ctx.lineWidth = 1;
        ctx.filter = "blur(1px)";
        ctx.stroke();
        ctx.filter = "none";

        // === SPARKS flying off tangentially ===
        if (Math.random() < hp * 0.6) {
          const angle = Math.random() * Math.PI * 2;
          const spawnR = coreR + (Math.random() - 0.5) * 6;
          // Tangential + slight outward
          const tangent = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.8;
          const speed = 2 + Math.random() * 3;
          sparks.current.push({
            x: cx + Math.cos(angle) * spawnR,
            y: cy + Math.sin(angle) * spawnR,
            vx: Math.cos(tangent) * speed + Math.cos(angle) * 1.5,
            vy: Math.sin(tangent) * speed + Math.sin(angle) * 1.5,
            life: 0,
            maxLife: 15 + Math.random() * 25,
            size: 0.5 + Math.random() * 1.5,
            hue: 20 + Math.random() * 25,
          });
        }

        // Draw sparks
        sparks.current = sparks.current.filter(s => {
          s.life++;
          if (s.life > s.maxLife) return false;
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.97;
          s.vy *= 0.97;
          if (s.x < -10 || s.x > size + 10 || s.y < -10 || s.y > size + 10) return false;

          const progress = s.life / s.maxLife;
          const alpha = Math.min(progress * 6, 1) * Math.pow(1 - progress, 2) * baseAlpha;

          // Streak
          const tailLen = Math.sqrt(s.vx * s.vx + s.vy * s.vy) * 4;
          const ang = Math.atan2(s.vy, s.vx);
          const tx = s.x - Math.cos(ang) * tailLen;
          const ty = s.y - Math.sin(ang) * tailLen;

          if (Number.isFinite(tx) && Number.isFinite(ty)) {
            const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
            grad.addColorStop(0, `hsla(${s.hue}, 100%, 70%, 0)`);
            grad.addColorStop(1, `hsla(${s.hue}, 100%, 85%, ${alpha})`);
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.size;
            ctx.stroke();
          }

          // Bright tip
          ctx.fillStyle = `hsla(${s.hue + 10}, 100%, 95%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
          ctx.fill();

          return true;
        });

        ctx.restore();
      }

      animFrame.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animFrame.current);
  }, [isHovered, size, cx, cy]);

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
      <MandalaCanvas isHovered={isHovered} size={size} />

      <div className="absolute rounded-full bg-background z-[5]" style={{ inset: size * 0.15 }} />

      <div
        className="absolute rounded-full overflow-hidden bg-muted flex items-center justify-center z-[6]"
        style={{ inset: size * 0.17, border: "2px solid hsl(35, 100%, 55% / 0.25)" }}
      >
        <img src={achsahImg} alt="Achsah" className="w-full h-full object-cover" />
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

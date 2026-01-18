import { motion } from "framer-motion";

interface LevelIndicatorProps {
  current: number;
  total: number;
}

export const LevelIndicator = ({ current, total }: LevelIndicatorProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Level</span>
      <div className="flex items-baseline gap-1 font-mono">
        <motion.span 
          key={current}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary text-glow"
        >
          {current.toString().padStart(2, "0")}
        </motion.span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{total.toString().padStart(2, "0")}</span>
      </div>
    </div>
  );
};

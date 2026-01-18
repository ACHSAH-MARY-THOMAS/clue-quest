import { motion } from "framer-motion";
import { CheckCircle2, Hand } from "lucide-react";

interface LevelUnlockedProps {
  onContinue: () => void;
  isFinalLevel?: boolean;
}

export const LevelUnlocked = ({ onContinue, isFinalLevel = false }: LevelUnlockedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center p-8 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center glow-success"
        >
          <CheckCircle2 className="w-10 h-10 text-success" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-mono font-bold text-success mb-4 tracking-wider"
        >
          {isFinalLevel ? "MISSION COMPLETE" : "LEVEL UNLOCKED"}
        </motion.h2>

        {!isFinalLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Hand className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Action Required</span>
            </div>
            <p className="text-foreground/80 font-mono text-sm">
              Call a volunteer to receive your clue slip.
            </p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={onContinue}
          className="px-8 py-3 bg-primary text-primary-foreground font-mono font-semibold tracking-wider rounded hover:bg-primary/90 transition-colors glow-primary"
        >
          {isFinalLevel ? "VIEW RESULTS" : "CONTINUE"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

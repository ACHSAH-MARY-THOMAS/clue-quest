import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, AlertCircle, Loader2 } from "lucide-react";

interface AnswerInputProps {
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
  cooldown?: number;
}

export const AnswerInput = ({ onSubmit, disabled = false, cooldown = 0 }: AnswerInputProps) => {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [remainingCooldown, setRemainingCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || disabled || remainingCooldown > 0) return;

    setStatus("loading");
    const isCorrect = await onSubmit(answer.trim());
    
    if (isCorrect) {
      setStatus("success");
    } else {
      setStatus("error");
      if (cooldown > 0) {
        setRemainingCooldown(cooldown);
        const interval = setInterval(() => {
          setRemainingCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      setTimeout(() => setStatus("idle"), 2000);
    }
    setAnswer("");
  };

  const isLocked = disabled || remainingCooldown > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          placeholder={isLocked ? "LOCKED" : "ENTER KEY"}
          disabled={isLocked || status === "loading"}
          className={`
            w-full px-4 py-4 pr-14
            bg-input border-2 rounded-md
            font-mono text-center text-lg tracking-[0.2em] uppercase
            placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-0
            transition-all duration-300
            ${status === "error" ? "border-destructive glow-error" : ""}
            ${status === "success" ? "border-success glow-success" : ""}
            ${status === "idle" ? "border-border focus:border-primary focus:glow-primary" : ""}
            ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
        <button
          type="submit"
          disabled={isLocked || status === "loading" || !answer.trim()}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2
            w-10 h-10 rounded flex items-center justify-center
            transition-all duration-200
            ${isLocked || !answer.trim() 
              ? "text-muted-foreground" 
              : "text-primary hover:bg-primary/10"
            }
          `}
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isLocked ? (
            <Lock className="w-5 h-5" />
          ) : (
            <Unlock className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 mt-3 text-destructive"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-mono">INCORRECT KEY</span>
          </motion.div>
        )}
        {remainingCooldown > 0 && status === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-3 text-muted-foreground text-sm font-mono"
          >
            Cooldown: {remainingCooldown}s
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

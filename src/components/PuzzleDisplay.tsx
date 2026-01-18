import { motion } from "framer-motion";

interface PuzzleDisplayProps {
  title: string;
  content: string;
  hint?: string;
  imageUrl?: string;
}

export const PuzzleDisplay = ({ title, content, hint, imageUrl }: PuzzleDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {imageUrl && (
            <div className="relative aspect-video rounded-md overflow-hidden border border-border">
              <img 
                src={imageUrl} 
                alt="Puzzle clue" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 scanline" />
            </div>
          )}

          <div className="font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>

          {hint && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Hint
              </p>
              <p className="text-sm text-muted-foreground italic">
                {hint}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

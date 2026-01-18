import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Timer } from "@/components/Timer";
import { LevelIndicator } from "@/components/LevelIndicator";
import { PuzzleDisplay } from "@/components/PuzzleDisplay";
import { AnswerInput } from "@/components/AnswerInput";
import { LevelUnlocked } from "@/components/LevelUnlocked";
import { LogOut } from "lucide-react";

// Demo levels - will be replaced with database
const DEMO_LEVELS = [
  {
    id: 1,
    title: "Cipher One",
    content: "I speak without a mouth and hear without ears.\nI have no body, but I come alive with the wind.\n\nWhat am I?",
    hint: "Think about what happens when you shout in a canyon.",
    answer: "ECHO"
  },
  {
    id: 2,
    title: "Cipher Two", 
    content: "GUVF VF N FVZCYR PVCURE\n\nDecode the message above.\nEach letter has been shifted by the same amount.",
    hint: "Julius would know this cipher well.",
    answer: "THIS IS A SIMPLE CIPHER"
  },
  {
    id: 3,
    title: "Cipher Three",
    content: "I have cities, but no houses.\nI have mountains, but no trees.\nI have water, but no fish.\nI have roads, but no cars.\n\nWhat am I?",
    answer: "MAP"
  },
  {
    id: 4,
    title: "Final Cipher",
    content: "Combine all the clue slips you've collected.\nThe final answer awaits those who paid attention.",
    hint: "Your physical clues hold the key.",
    answer: "LOCKSTEP"
  }
];

const Game = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showUnlocked, setShowUnlocked] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    const teamData = sessionStorage.getItem("lockstep_team");
    if (!teamData) {
      navigate("/");
      return;
    }
    
    const parsed = JSON.parse(teamData);
    setTeamId(parsed.teamId);
    setStartTime(new Date(parsed.startTime));
    
    // Load saved progress
    const savedLevel = sessionStorage.getItem("lockstep_level");
    if (savedLevel) {
      setCurrentLevel(parseInt(savedLevel));
    }
  }, [navigate]);

  const handleAnswer = async (answer: string): Promise<boolean> => {
    const level = DEMO_LEVELS[currentLevel - 1];
    if (!level) return false;

    // Simulate server check delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (answer.toUpperCase() === level.answer) {
      setShowUnlocked(true);
      return true;
    }
    return false;
  };

  const handleContinue = () => {
    setShowUnlocked(false);
    if (currentLevel < DEMO_LEVELS.length) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      sessionStorage.setItem("lockstep_level", nextLevel.toString());
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("lockstep_team");
    sessionStorage.removeItem("lockstep_level");
    navigate("/");
  };

  const currentPuzzle = DEMO_LEVELS[currentLevel - 1];
  const isFinalLevel = currentLevel === DEMO_LEVELS.length;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <div className="fixed inset-0 noise opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="small" />
            
            <div className="flex items-center gap-6">
              <Timer startTime={startTime} />
              
              <div className="text-xs font-mono text-muted-foreground">
                {teamId}
              </div>
              
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Level Indicator */}
          <div className="flex justify-center">
            <LevelIndicator current={currentLevel} total={DEMO_LEVELS.length} />
          </div>

          {/* Puzzle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLevel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {currentPuzzle && (
                <PuzzleDisplay
                  title={currentPuzzle.title}
                  content={currentPuzzle.content}
                  hint={currentPuzzle.hint}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Answer Input */}
          <div className="w-full mt-4">
            <AnswerInput 
              onSubmit={handleAnswer} 
              cooldown={5}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground font-mono">
            All answers are case-insensitive
          </p>
        </div>
      </footer>

      {/* Level Unlocked Modal */}
      <AnimatePresence>
        {showUnlocked && (
          <LevelUnlocked 
            onContinue={handleContinue} 
            isFinalLevel={isFinalLevel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;

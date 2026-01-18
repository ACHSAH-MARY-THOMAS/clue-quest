import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  startTime: Date;
}

export const Timer = ({ startTime }: TimerProps) => {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center gap-2 font-mono text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span className="text-sm tracking-wider">{elapsed}</span>
    </div>
  );
};

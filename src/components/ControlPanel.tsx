import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";

const ControlPanel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);

  const buttons = [
    { icon: isPlaying ? Pause : Play, label: isPlaying ? "Pause" : "Play", action: () => setIsPlaying(!isPlaying), accent: true },
    { icon: SkipForward, label: "Step", action: () => {}, accent: false },
    { icon: RotateCcw, label: "Reset", action: () => setIsPlaying(false), accent: false },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Controls</h3>
        <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"}`} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {buttons.map((btn, i) => {
          const Icon = btn.icon;
          return (
            <motion.button
              key={btn.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.action}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                btn.accent
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-secondary-foreground hover:bg-surface-3"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {btn.label}
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="w-3 h-3" />
            Speed
          </div>
          <span className="text-xs font-mono text-primary">{speed}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
            [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_2px_hsl(175_80%_50%/0.3)]"
        />
      </div>
    </motion.div>
  );
};

export default ControlPanel;

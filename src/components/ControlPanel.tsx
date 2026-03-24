import { motion } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, Zap,
} from "lucide-react";
import { useStepStore } from "../store/stepStore";

const ControlPanel = () => {
  const isPlaying  = useStepStore((s) => s.isPlaying);
  const status     = useStepStore((s) => s.status);
  const currentStep = useStepStore((s) => s.currentStep);
  const frames     = useStepStore((s) => s.frames);
  const speed      = useStepStore((s) => s.speed);
  const play       = useStepStore((s) => s.play);
  const pause      = useStepStore((s) => s.pause);
  const nextStep   = useStepStore((s) => s.nextStep);
  const prevStep   = useStepStore((s) => s.prevStep);
  const reset      = useStepStore((s) => s.reset);
  const setSpeed   = useStepStore((s) => s.setSpeed);
  const goToStep   = useStepStore((s) => s.goToStep);

  const atEnd   = currentStep >= frames.length - 1;
  const atStart = currentStep === 0;

  const buttons = [
    {
      icon: SkipBack,
      label: "Back",
      action: prevStep,
      accent: false,
      disabled: atStart,
    },
    {
      icon: isPlaying ? Pause : Play,
      label: isPlaying ? "Pause" : "Play",
      action: isPlaying ? pause : play,
      accent: true,
      disabled: frames.length === 0,
    },
    {
      icon: SkipForward,
      label: "Step",
      action: nextStep,
      accent: false,
      disabled: atEnd,
    },
    {
      icon: RotateCcw,
      label: "Reset",
      action: reset,
      accent: false,
      disabled: false,
    },
  ];

  const frameCount = frames.length;
  const maxDots = 15;
  const sortedDotIndices = (() => {
    const dotIndices = new Set<number>();
    if (frameCount <= 0) return [] as number[];

    dotIndices.add(0);
    dotIndices.add(frameCount - 1);

    if (frameCount <= maxDots) {
      for (let i = 0; i < frameCount; i++) dotIndices.add(i);
    } else {
      const step = (frameCount - 1) / (maxDots - 1);
      for (let i = 0; i < maxDots; i++) dotIndices.add(Math.round(i * step));
    }

    return Array.from(dotIndices).sort((a, b) => a - b);
  })();

  const progressWidthPct = frameCount > 0 ? ((currentStep + 1) / frameCount) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-4"
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Controls
        </h3>
        <div className="flex items-center gap-2">
          {frames.length > 0 && (
            <span className="text-[10px] font-mono text-primary">
              {currentStep + 1} / {frames.length}
            </span>
          )}
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isPlaying
                ? "bg-primary animate-pulse-glow"
                : status === "done"
                ? "bg-yellow-400"
                : "bg-muted-foreground/40"
            }`}
          />
        </div>
      </div>

      {/* ── Frame scrubber ───────────────────────────────────────────── */}
      {frames.length > 1 && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-secondary/60 overflow-hidden">
              <div
                className="h-full bg-primary transition-[width] duration-200"
                style={{ width: `${progressWidthPct}%` }}
              />
            </div>
            <div className="flex gap-1">
              {sortedDotIndices.map((idx) => {
                const isActive = idx === currentStep;
                return (
                  <button
                    key={idx}
                    type="button"
                    title={`Frame ${idx + 1}`}
                    aria-label={`Go to frame ${idx + 1}`}
                    onClick={() => {
                      pause();
                      goToStep(idx);
                    }}
                    className={`w-3 h-3 rounded-full border transition-colors ${
                      isActive
                        ? "bg-primary border-primary/80"
                        : "bg-secondary/40 border-border hover:bg-secondary/70"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Playback buttons ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <motion.button
              key={btn.label}
              whileHover={btn.disabled ? {} : { scale: 1.05 }}
              whileTap={btn.disabled ? {} : { scale: 0.95 }}
              onClick={btn.disabled ? undefined : btn.action}
              disabled={btn.disabled}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all
                disabled:opacity-40 disabled:cursor-not-allowed ${
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

      {/* ── Speed slider ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="w-3 h-3" />
            Speed
          </div>
          <span className="text-xs font-mono text-primary">{speed}%</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[10, 15, 20, 25, 30, 40, 50, 75, 100].map((pct) => (
            <motion.button
              key={pct}
              type="button"
              whileHover={{ scale: speed === pct ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSpeed(pct)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                speed === pct
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
              }`}
            >
              {pct}%
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ControlPanel;

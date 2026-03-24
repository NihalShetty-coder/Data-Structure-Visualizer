import Sidebar from "@/components/Sidebar";
import VisualizationCanvas from "@/components/VisualizationCanvas";
import ControlPanel from "@/components/ControlPanel";
import CodeEditorMock from "@/components/CodeEditorMock";
import InputPanel from "@/components/InputPanel";
import { motion } from "framer-motion";
import { useDsContext, STRUCTURE_LABELS, OPERATION_LABELS } from "@/store/dsContext";
import { useStepStore } from "@/store/stepStore";
import { useAnimationScheduler } from "@/hooks/useAnimationScheduler";

const Index = () => {
  // All state now lives in Zustand — no local useState needed
  const activeStructure = useDsContext((s) => s.activeStructure);
  const activeOperation = useDsContext((s) => s.activeOperation);
  const setStructure    = useDsContext((s) => s.setStructure);

  const isPlaying      = useStepStore((s) => s.isPlaying);
  const currentFrameIdx = useStepStore((s) => s.currentStep);
  const frames          = useStepStore((s) => s.frames);

  // Mount the animation scheduler — drives frame ticking automatically
  useAnimationScheduler();

  const statusLabel = isPlaying ? "playing" : frames.length > 0 ? "paused" : "idle";
  const statusColor =
    isPlaying ? "text-primary" : frames.length > 0 ? "text-yellow-400" : "text-muted-foreground";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        selected={activeStructure}
        onSelect={(id) => setStructure(id as typeof activeStructure)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-11 border-b border-border bg-surface-1 flex items-center px-4 justify-between flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">Data Structure</span>
            <span className="text-xs font-semibold text-foreground">
              {STRUCTURE_LABELS[activeStructure]}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-mono text-muted-foreground">
              {OPERATION_LABELS[activeOperation]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {frames.length > 0 && (
              <span className="text-[10px] font-mono text-muted-foreground">
                {currentFrameIdx + 1} / {frames.length}
              </span>
            )}
            <div
              className={`h-5 px-2 rounded-full bg-primary/10 text-[10px] font-mono flex items-center ${statusColor}`}
            >
              {statusLabel}
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Visualization area */}
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            <VisualizationCanvas structure={activeStructure} />
            <ControlPanel />
          </div>

          {/* Right panel */}
          <div className="w-80 border-l border-border p-4 overflow-y-auto flex-shrink-0 space-y-4">
            <InputPanel />
            <CodeEditorMock structure={activeStructure} />
            <InfoCard structure={activeStructure} operation={activeOperation} frames={frames.length} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────

interface InfoCardProps {
  structure: string;
  operation: string;
  frames: number;
}

const complexityMap: Record<string, string> = {
  "traverse":      "O(n)",
  "linear-search": "O(n)",
  "binary-search": "O(log n)",
  "insert":        "O(n)",
  "delete":        "O(n)",
  "bubble-sort":   "O(n²)",
  "insert-head":   "O(1)",
  "insert-tail":   "O(1)",
  "delete-node":   "O(n)",
  "push":          "O(1)",
  "pop":           "O(1)",
  "peek":          "O(1)",
  "enqueue":       "O(1)",
  "dequeue":       "O(1)",
  "inorder":       "O(n)",
  "preorder":      "O(n)",
  "postorder":     "O(n)",
  "bfs":           "O(V+E)",
  "insert-bst":    "O(log n)",
  "dfs":           "O(V+E)",
};

const InfoCard = ({ structure, operation, frames }: InfoCardProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="bg-card border border-border rounded-lg p-3"
  >
    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
      Info
    </h4>
    <div className="space-y-1.5">
      <InfoRow label="Type"       value={structure.replace("-", " ")} />
      <InfoRow label="Frames"     value={frames > 0 ? String(frames) : "—"} />
      <InfoRow label="Complexity" value={complexityMap[operation] ?? "—"} />
      <InfoRow label="Operation"  value={operation} accent />
    </div>
  </motion.div>
);

const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-mono ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
  </div>
);

export default Index;

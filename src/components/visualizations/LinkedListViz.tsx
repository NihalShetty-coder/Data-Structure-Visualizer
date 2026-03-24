import { motion, AnimatePresence } from "framer-motion";
import { useStepStore } from "../../store/stepStore";
import { nodeColor } from "./nodeColors";
import type { DSNode } from "../../engine/types";

const Arrow = () => (
  <div className="flex items-center text-muted-foreground text-sm select-none">
    <div className="w-6 h-px bg-border relative">
      <span className="absolute -right-1 -top-2 text-xs">›</span>
    </div>
  </div>
);

const NullTerminator = () => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
      <span className="text-[10px] font-mono text-muted-foreground">null</span>
    </div>
  </div>
);

const NodeBox = ({ node, pointerLabels }: { node: DSNode; pointerLabels: string[] }) => {
  const colors = nodeColor(node.state);
  return (
    <motion.div
      layout
      key={node.id}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative flex flex-col items-center"
    >
      {pointerLabels.length > 0 && (
        <div className="absolute -top-6 flex gap-1">
          {pointerLabels.map((l) => (
            <span key={l} className="text-[10px] text-primary font-mono bg-primary/10 px-1 rounded">
              {l}
            </span>
          ))}
        </div>
      )}
      <div
        className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-sm font-semibold transition-all duration-300
          ${colors.border} ${colors.bg} ${colors.text}
          ${colors.glow ? "shadow-[0_0_12px_2px_hsl(175_80%_50%/0.35)]" : ""}
        `}
      >
        {node.value}
      </div>
    </motion.div>
  );
};

const LinkedListViz = () => {
  const { frames, currentStep } = useStepStore();
  const frame = frames[currentStep];

  if (!frame || frame.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Press <span className="mx-1 font-mono text-primary">Visualize</span> to start
      </div>
    );
  }

  const pointers = frame.pointers ?? {};

  return (
    <div className="flex items-center justify-center h-full overflow-x-auto px-6">
      <div className="flex items-center gap-0 flex-wrap justify-center gap-y-6">
        <AnimatePresence mode="popLayout">
          {frame.nodes.map((node) => {
            const ptrLabels = Object.entries(pointers)
              .filter(([, id]) => id === node.id)
              .map(([n]) => n);
            return (
              <div key={node.id} className="flex items-center">
                <NodeBox node={node} pointerLabels={ptrLabels} />
                <Arrow />
              </div>
            );
          })}
        </AnimatePresence>
        <NullTerminator />
      </div>
    </div>
  );
};

export default LinkedListViz;

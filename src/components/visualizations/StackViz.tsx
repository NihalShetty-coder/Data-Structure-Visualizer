import { motion, AnimatePresence } from "framer-motion";
import { useStepStore } from "../../store/stepStore";
import { nodeColor } from "./nodeColors";

const StackViz = () => {
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

  // Stack renders top-to-bottom (first node = top of stack)
  const reversedNodes = [...frame.nodes].reverse();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-0 relative">
        {/* Stack label */}
        <span className="text-[10px] text-muted-foreground font-mono mb-2">TOP</span>

        <AnimatePresence mode="popLayout">
          {reversedNodes.map((node) => {
            const colors = nodeColor(node.state);
            const ptrLabels = Object.entries(pointers)
              .filter(([, id]) => id === node.id)
              .map(([n]) => n);

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ y: -40, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -40, opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="relative"
              >
                {ptrLabels.length > 0 && (
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-8 h-px bg-border mt-2.5" />
                    {ptrLabels.map((l) => (
                      <span key={l} className="text-[10px] text-primary font-mono whitespace-nowrap">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`w-36 h-12 border-2 flex items-center justify-center font-mono text-sm font-semibold
                    transition-all duration-300 ${colors.border} ${colors.bg} ${colors.text}
                    ${colors.glow ? "shadow-[0_0_12px_2px_hsl(175_80%_50%/0.35)]" : ""}
                  `}
                >
                  {node.value}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Stack base */}
        <div className="w-36 h-2 bg-surface-3 border border-border rounded-b-sm" />
        <span className="text-[10px] text-muted-foreground font-mono mt-2">BOTTOM</span>
      </div>
    </div>
  );
};

export default StackViz;

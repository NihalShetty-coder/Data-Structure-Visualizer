import { motion, AnimatePresence } from "framer-motion";
import { useStepStore } from "../../store/stepStore";
import { nodeColor } from "./nodeColors";

const QueueViz = () => {
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
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {/* Head / Tail labels */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
        <span className="text-primary">FRONT</span>
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-violet-400">BACK</span>
      </div>

      {/* Queue items */}
      <div className="flex items-center gap-0 overflow-x-auto px-2">
        {/* Front gate */}
        <div className="w-2 h-14 bg-primary/30 rounded-l border border-primary/40" />

        <AnimatePresence mode="popLayout">
          {frame.nodes.map((node) => {
            const colors = nodeColor(node.state);
            const ptrLabels = Object.entries(pointers)
              .filter(([, id]) => id === node.id)
              .map(([n]) => n);

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="relative"
              >
                {ptrLabels.length > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                    {ptrLabels.map((l) => (
                      <span key={l} className="text-[10px] text-primary font-mono bg-primary/10 px-1 rounded">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`w-14 h-14 border-y-2 flex items-center justify-center font-mono text-sm font-semibold
                    transition-all duration-300 border-x ${colors.border} ${colors.bg} ${colors.text}
                    ${colors.glow ? "shadow-[0_0_12px_2px_hsl(175_80%_50%/0.35)]" : ""}
                  `}
                >
                  {node.value}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Back gate */}
        <div className="w-2 h-14 bg-violet-400/30 rounded-r border border-violet-400/40" />
      </div>
    </div>
  );
};

export default QueueViz;

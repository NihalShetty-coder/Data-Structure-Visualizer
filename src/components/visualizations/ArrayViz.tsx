import { motion, AnimatePresence } from "framer-motion";
import { useStepStore } from "../../store/stepStore";
import { nodeColor } from "./nodeColors";

const ArrayViz = () => {
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
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-wrap gap-2 justify-center px-4">
        <AnimatePresence mode="popLayout">
          {frame.nodes.map((node, i) => {
            const colors = nodeColor(node.state);
            // resolve pointer labels for this node
            const ptrLabels = Object.entries(pointers)
              .filter(([, id]) => id === node.id)
              .map(([name]) => name);

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: node.state === "active" || node.state === "comparing" ? -10 : 0,
                }}
                exit={{ scale: 0, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="relative flex flex-col items-center"
              >
                {/* Pointer labels above cell */}
                {ptrLabels.length > 0 && (
                  <div className="absolute -top-6 flex gap-1">
                    {ptrLabels.map((l) => (
                      <span key={l} className="text-[10px] text-primary font-mono bg-primary/10 px-1 rounded">
                        {l}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cell */}
                <div
                  className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center font-mono text-sm font-semibold transition-all duration-300
                    ${colors.border} ${colors.bg} ${colors.text}
                    ${colors.glow ? "shadow-[0_0_12px_2px_hsl(175_80%_50%/0.35)]" : ""}
                  `}
                >
                  {node.value}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 font-mono">[{i}]</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArrayViz;

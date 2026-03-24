import { motion, AnimatePresence } from "framer-motion";
import ArrayViz from "./visualizations/ArrayViz";
import LinkedListViz from "./visualizations/LinkedListViz";
import StackViz from "./visualizations/StackViz";
import QueueViz from "./visualizations/QueueViz";
import TreeViz from "./visualizations/TreeViz";
import GraphViz from "./visualizations/GraphViz";
import { useStepStore } from "../store/stepStore";

const vizMap: Record<string, React.FC> = {
  array: ArrayViz,
  "linked-list": LinkedListViz,
  stack: StackViz,
  queue: QueueViz,
  "binary-tree": TreeViz,
  graph: GraphViz,
};

const labels: Record<string, string> = {
  array: "Array Traversal",
  "linked-list": "Linked List Traversal",
  stack: "Stack Push / Pop",
  queue: "Queue Enqueue / Dequeue",
  "binary-tree": "Binary Tree Visualization",
  graph: "Graph BFS Traversal",
};

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
    Press <span className="mx-1 font-mono text-primary">Visualize</span> to start
  </div>
);

const VisualizationCanvas = ({ structure }: { structure: string }) => {
  const VizComponent = vizMap[structure] || ArrayViz;
  const frames = useStepStore((s) => s.frames);

  const showEmpty = frames.length === 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex-1 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-medium text-foreground">
            {labels[structure] || "Visualization"}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">canvas</span>
      </div>
      <div className="flex-1 dot-bg relative min-h-[280px]">
        {showEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <EmptyState />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={structure}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <VizComponent />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default VisualizationCanvas;

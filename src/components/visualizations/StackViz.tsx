import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const allItems = [10, 20, 30, 40, 50];

const StackViz = () => {
  const [items, setItems] = useState<number[]>([]);
  const [phase, setPhase] = useState<"push" | "pop">("push");
  const [pushIdx, setPushIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === "push") {
        if (pushIdx < allItems.length) {
          setItems((prev) => [...prev, allItems[pushIdx]]);
          setPushIdx((prev) => prev + 1);
        } else {
          setPhase("pop");
        }
      } else {
        if (items.length > 0) {
          setItems((prev) => prev.slice(0, -1));
        } else {
          setPhase("push");
          setPushIdx(0);
        }
      }
    }, 600);
    return () => clearInterval(interval);
  }, [phase, pushIdx, items.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-xs text-muted-foreground font-mono mb-2">
        ← TOP
      </div>
      <div className="flex flex-col-reverse gap-1 w-24">
        <AnimatePresence>
          {items.map((val, i) => (
            <motion.div
              key={`${val}-${i}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`h-10 rounded-md flex items-center justify-center font-mono text-sm font-semibold border ${
                i === items.length - 1
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface-2 text-foreground"
              }`}
            >
              {val}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="w-24 h-0.5 bg-border mt-1 rounded-full" />
      <div className="text-[10px] text-muted-foreground font-mono mt-1">BOTTOM</div>
    </div>
  );
};

export default StackViz;

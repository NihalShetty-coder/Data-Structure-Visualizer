import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const QueueViz = () => {
  const [items, setItems] = useState<string[]>(["A", "B", "C"]);
  const nextChar = "DEFGHIJKLMNOP";
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        if (prev.length >= 6) {
          return prev.slice(1);
        }
        return [...prev, nextChar[charIdx % nextChar.length]];
      });
      setCharIdx((prev) => prev + 1);
    }, 800);
    return () => clearInterval(interval);
  }, [charIdx]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-1">
        <div className="text-[10px] text-muted-foreground font-mono mr-2 rotate-180" style={{ writingMode: "vertical-rl" }}>
          FRONT
        </div>
        <div className="flex gap-1.5">
          <AnimatePresence mode="popLayout">
            {items.map((val, i) => (
              <motion.div
                key={val + "-" + i}
                layout
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`w-12 h-12 rounded-md flex items-center justify-center font-mono text-sm font-bold border ${
                  i === 0
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-surface-2 text-foreground"
                }`}
              >
                {val}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-[10px] text-muted-foreground font-mono ml-2 rotate-180" style={{ writingMode: "vertical-rl" }}>
          REAR
        </div>
      </div>
    </div>
  );
};

export default QueueViz;

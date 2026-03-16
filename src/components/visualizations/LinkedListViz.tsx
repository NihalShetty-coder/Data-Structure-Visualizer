import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const nodes = ["H", "E", "L", "L", "O"];

const LinkedListViz = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= nodes.length - 1 ? -1 : prev + 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-0">
        {nodes.map((val, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                borderColor: i <= activeIndex ? "hsl(175, 80%, 50%)" : "hsl(220, 16%, 18%)",
                backgroundColor: i === activeIndex ? "hsl(175, 80%, 50%, 0.15)" : "transparent",
              }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="w-14 h-14 border-2 rounded-lg flex items-center justify-center font-mono text-lg font-bold text-foreground relative"
            >
              {val}
              {i <= activeIndex && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                />
              )}
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.15 }}
                className="flex items-center origin-left"
              >
                <div className={`w-8 h-0.5 ${i < activeIndex ? "bg-primary" : "bg-border"} transition-colors`} />
                <div className={`w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] ${i < activeIndex ? "border-l-primary" : "border-l-border"} transition-colors`} />
              </motion.div>
            )}
          </div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="ml-2 text-xs text-muted-foreground font-mono"
        >
          null
        </motion.div>
      </div>
    </div>
  );
};

export default LinkedListViz;

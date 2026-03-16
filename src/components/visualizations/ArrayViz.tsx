import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const values = [42, 17, 8, 31, 56, 23, 64, 12];

const ArrayViz = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % values.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex gap-2">
        {values.map((val, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: activeIndex === i ? -12 : 0,
            }}
            transition={{
              delay: i * 0.08,
              y: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={`relative flex flex-col items-center`}
          >
            <motion.div
              animate={{
                borderColor: activeIndex === i ? "hsl(175, 80%, 50%)" : "hsl(220, 16%, 18%)",
                backgroundColor: activeIndex === i ? "hsl(175, 80%, 50%, 0.1)" : "transparent",
              }}
              className="w-14 h-14 border-2 rounded-lg flex items-center justify-center font-mono text-sm font-semibold text-foreground"
            >
              {val}
            </motion.div>
            <span className="text-[10px] text-muted-foreground mt-1 font-mono">[{i}]</span>
            {activeIndex === i && (
              <motion.div
                layoutId="array-pointer"
                className="absolute -top-6 text-primary text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ▼
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ArrayViz;

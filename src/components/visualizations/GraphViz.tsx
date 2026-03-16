import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const graphNodes = [
  { id: 0, label: "A", x: 190, y: 30 },
  { id: 1, label: "B", x: 90, y: 100 },
  { id: 2, label: "C", x: 290, y: 100 },
  { id: 3, label: "D", x: 50, y: 190 },
  { id: 4, label: "E", x: 190, y: 190 },
  { id: 5, label: "F", x: 330, y: 190 },
];

const edges = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5],
];

const bfsOrder = [0, 1, 2, 3, 4, 5];

const GraphViz = () => {
  const [visitedCount, setVisitedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitedCount((prev) => (prev >= bfsOrder.length ? 0 : prev + 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const visited = new Set(bfsOrder.slice(0, visitedCount));
  const activeNode = visitedCount > 0 ? bfsOrder[visitedCount - 1] : -1;

  return (
    <div className="flex items-center justify-center h-full">
      <svg width="400" height="240" viewBox="0 0 400 240" className="overflow-visible">
        {edges.map(([a, b], i) => {
          const na = graphNodes[a];
          const nb = graphNodes[b];
          const edgeActive = visited.has(a) && visited.has(b);
          return (
            <motion.line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                stroke: edgeActive ? "hsl(211, 100%, 50%)" : "hsl(var(--border))",
              }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            />
          );
        })}
        {graphNodes.map((node) => (
          <motion.g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={20}
              fill={
                activeNode === node.id
                  ? "hsl(211, 100%, 50%, 0.2)"
                  : visited.has(node.id)
                  ? "hsl(211, 100%, 50%, 0.08)"
                  : "hsl(var(--surface-2))"
              }
              stroke={visited.has(node.id) ? "hsl(211, 100%, 50%)" : "hsl(var(--border))"}
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: node.id * 0.1, type: "spring" }}
            />
            {activeNode === node.id && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill="none"
                stroke="hsl(211, 100%, 50%)"
                strokeWidth={1}
                initial={{ r: 20, opacity: 1 }}
                animate={{ r: 35, opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="text-sm font-mono font-bold"
              fill={visited.has(node.id) ? "hsl(175, 80%, 50%)" : "hsl(210, 20%, 90%)"}
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default GraphViz;

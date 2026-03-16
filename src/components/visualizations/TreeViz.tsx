import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TreeNode {
  id: number;
  val: number;
  x: number;
  y: number;
  children: number[];
}

const treeNodes: TreeNode[] = [
  { id: 0, val: 50, x: 200, y: 30, children: [1, 2] },
  { id: 1, val: 30, x: 120, y: 100, children: [3, 4] },
  { id: 2, val: 70, x: 280, y: 100, children: [5, 6] },
  { id: 3, val: 20, x: 70, y: 170, children: [] },
  { id: 4, val: 40, x: 160, y: 170, children: [] },
  { id: 5, val: 60, x: 240, y: 170, children: [] },
  { id: 6, val: 80, x: 320, y: 170, children: [] },
];

// Inorder: 3,1,4,0,5,2,6
const inorderSequence = [3, 1, 4, 0, 5, 2, 6];

const TreeViz = () => {
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % inorderSequence.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const activeNodeId = inorderSequence[activeIdx] ?? -1;

  return (
    <div className="flex items-center justify-center h-full">
      <svg width="400" height="220" viewBox="0 0 400 220" className="overflow-visible">
        {/* Edges */}
        {treeNodes.map((node) =>
          node.children.map((childId) => {
            const child = treeNodes[childId];
            return (
              <motion.line
                key={`${node.id}-${childId}`}
                x1={node.x}
                y1={node.y + 18}
                x2={child.x}
                y2={child.y - 18}
                stroke="hsl(220, 16%, 18%)"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  stroke: activeNodeId === childId || activeNodeId === node.id 
                    ? "hsl(175, 80%, 50%)" 
                    : "hsl(220, 16%, 18%)"
                }}
                transition={{ duration: 0.5 }}
              />
            );
          })
        )}
        {/* Nodes */}
        {treeNodes.map((node) => (
          <motion.g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={18}
              fill={activeNodeId === node.id ? "hsl(175, 80%, 50%, 0.15)" : "hsl(220, 18%, 10%)"}
              stroke={activeNodeId === node.id ? "hsl(175, 80%, 50%)" : "hsl(220, 16%, 18%)"}
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: node.id * 0.08, type: "spring" }}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className="text-xs font-mono font-bold"
              fill={activeNodeId === node.id ? "hsl(175, 80%, 50%)" : "hsl(210, 20%, 90%)"}
            >
              {node.val}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default TreeViz;

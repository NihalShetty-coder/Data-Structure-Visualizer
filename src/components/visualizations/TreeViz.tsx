import { motion, AnimatePresence } from "framer-motion";
import { useStepStore } from "../../store/stepStore";

const CELL_W = 60;
const CELL_H = 80;
const MIN_X = 40;
const MIN_Y = 40;

const TreeViz = () => {
  const { frames, currentStep } = useStepStore();
  const frame = frames[currentStep];

  if (!frame || frame.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Press <span className="mx-1 font-mono text-primary">Visualize</span> to start
      </div>
    );
  }

  const nodes = frame.nodes;
  const edges = frame.edges ?? [];
  const pointers = frame.pointers ?? {};

  // Use x,y coordinates from the engine (already computed in binaryTree.ts)
  const minX = Math.min(...nodes.map((n) => n.x ?? 0));
  const maxX = Math.max(...nodes.map((n) => n.x ?? 0));
  const maxY = Math.max(...nodes.map((n) => n.y ?? 0));

  const svgW = Math.max((maxX - minX) + 200, 400);
  const svgH = Math.max(maxY + 100, 200);

  const toSvgX = (x: number) => (x - minX) + MIN_X;
  const toSvgY = (y: number) => y + MIN_Y;

  // Build edge list from the edges array
  const edgeList: { x1: number; y1: number; x2: number; y2: number; active: boolean }[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  
  for (const edge of edges) {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (fromNode && toNode && fromNode.x !== undefined && fromNode.y !== undefined && toNode.x !== undefined && toNode.y !== undefined) {
      edgeList.push({
        x1: toSvgX(fromNode.x),
        y1: toSvgY(fromNode.y),
        x2: toSvgX(toNode.x),
        y2: toSvgY(toNode.y),
        active: edge.state === "active" || edge.state === "visited",
      });
    }
  }

  return (
    <div className="flex items-center justify-center h-full overflow-auto">
      <svg
        width={svgW}
        height={svgH}
        style={{ minWidth: svgW, minHeight: svgH }}
      >
        {/* Edges */}
        {edgeList.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1}
            x2={e.x2} y2={e.y2}
            stroke={e.active ? "hsla(175, 80%, 50%, 0.95)" : "hsla(220, 16%, 45%, 0.75)"}
            strokeWidth={e.active ? 2.5 : 2}
          />
        ))}

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((n) => {
            const cx = n.x !== undefined ? toSvgX(n.x) : 0;
            const cy = n.y !== undefined ? toSvgY(n.y) : 0;
            const ptrLabels = Object.entries(pointers)
              .filter(([, id]) => id === n.id)
              .map(([label]) => label);

            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{ originX: cx, originY: cy }}
              >
                {/* Glow ring */}
                {n.state !== "idle" && (
                  <circle
                    cx={cx} cy={cy} r={22}
                    fill="none"
                    stroke={
                      n.state === "active" || n.state === "comparing"
                        ? "hsla(175, 80%, 50%, 0.7)"
                        : n.state === "visited"
                        ? "hsla(160, 60%, 50%, 0.6)"
                        : "transparent"
                    }
                    strokeWidth={3}
                  />
                )}
                {/* Circle */}
                <circle
                  cx={cx} cy={cy} r={19}
                  fill={
                    n.state === "active"
                      ? "hsla(175, 80%, 50%, 0.28)"
                      : n.state === "visited"
                      ? "hsla(160, 60%, 50%, 0.22)"
                      : "hsla(220, 16%, 55%, 0.16)"
                  }
                  stroke={
                    n.state === "active" || n.state === "comparing"
                      ? "hsla(175, 80%, 50%, 1)"
                      : n.state === "visited"
                      ? "hsla(160, 60%, 50%, 1)"
                      : "hsla(220, 16%, 35%, 0.95)"
                  }
                  strokeWidth={2.5}
                />
                <text
                  x={cx} y={cy + 5}
                  textAnchor="middle"
                  fontSize={12}
                  fontFamily="monospace"
                  fontWeight={600}
                  fill="black"
                >
                  {n.value}
                </text>
                {/* Pointer labels */}
                {ptrLabels.map((l, li) => (
                  <text
                    key={l}
                    x={cx} y={cy - 26 - li * 13}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="monospace"
                    fill="black"
                  >
                    {l}
                  </text>
                ))}
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default TreeViz;

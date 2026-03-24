import { motion, AnimatePresence } from "framer-motion";
import { useStepStore } from "../../store/stepStore";
import { nodeColor } from "./nodeColors";

const GraphViz = () => {
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

  // Use x,y coordinates from the engine
  const minX = Math.min(...nodes.map((n) => n.x ?? 0));
  const maxX = Math.max(...nodes.map((n) => n.x ?? 0));
  const minY = Math.min(...nodes.map((n) => n.y ?? 0));
  const maxY = Math.max(...nodes.map((n) => n.y ?? 0));

  const svgW = Math.max((maxX - minX) + 150, 400);
  const svgH = Math.max((maxY - minY) + 150, 300);

  const toSvgX = (x: number) => (x - minX) + 80;
  const toSvgY = (y: number) => (y - minY) + 80;

  // Build position map
  const posMap = new Map(
    nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }])
  );

  return (
    <div className="flex items-center justify-center h-full overflow-auto">
      <svg width={svgW} height={svgH}>
        {/* Arrowhead marker */}
        <defs>
          <marker
            id="graph-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="hsla(220, 16%, 40%, 0.85)" />
          </marker>
          <marker
            id="graph-arrowhead-active"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="hsla(175, 80%, 50%, 0.95)" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const fromPos = posMap.get(edge.from);
          const toPos = posMap.get(edge.to);
          if (!fromPos || !toPos) return null;
          const isActive = edge.state === "active" || edge.state === "visited";
          
          return (
            <motion.line
              key={i}
              x1={toSvgX(fromPos.x)} y1={toSvgY(fromPos.y)}
              x2={toSvgX(toPos.x)}   y2={toSvgY(toPos.y)}
              stroke={isActive ? "hsla(175, 80%, 50%, 0.95)" : "hsla(220, 16%, 45%, 0.7)"}
              strokeWidth={isActive ? 2.5 : 2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              markerEnd={isActive ? "url(#graph-arrowhead-active)" : "url(#graph-arrowhead)"}
            />
          );
        })}

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((n) => {
            const pos = posMap.get(n.id) ?? { x: 0, y: 0 };
            const cx = toSvgX(pos.x);
            const cy = toSvgY(pos.y);
            const colors = nodeColor(n.state);
            const ptrLabels = Object.entries(pointers)
              .filter(([, id]) => id === n.id)
              .map(([label]) => label);

            return (
              <motion.g
                key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ originX: cx, originY: cy }}
              >
                {/* Glow ring for active */}
                {(n.state === "active" || n.state === "comparing") && (
                  <circle
                    cx={cx} cy={cy} r={24}
                    fill="none"
                    stroke="hsla(175, 80%, 50%, 0.65)"
                    strokeWidth={3}
                  />
                )}
                <circle
                  cx={cx} cy={cy} r={20}
                  fill={
                    n.state === "active"
                      ? "hsla(175, 80%, 50%, 0.28)"
                      : n.state === "visited"
                      ? "hsla(160, 60%, 50%, 0.22)"
                      : "hsla(220, 16%, 55%, 0.16)"
                  }
                  stroke={
                    n.state === "active"
                      ? "hsla(175, 80%, 50%, 1)"
                      : n.state === "visited"
                      ? "hsla(160, 60%, 50%, 1)"
                      : "hsla(220, 16%, 40%, 0.95)"
                  }
                  strokeWidth={2.5}
                />
                {/* Node label */}
                <text
                  x={cx} y={cy + 4}
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
                    x={cx}
                    y={cy - 26 - li * 12}
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

export default GraphViz;

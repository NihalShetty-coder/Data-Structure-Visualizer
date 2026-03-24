import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";
import { useDsContext, STRUCTURE_OPERATIONS, OPERATION_LABELS, TREE_TYPE_LABELS, TreeType } from "../store/dsContext";
import { useStepStore } from "../store/stepStore";
import { createFrames } from "../engine/createFrames";
import type { OperationKey } from "../engine/types";

const InputPanel = () => {
  const activeStructure = useDsContext((s) => s.activeStructure);
  const activeOperation = useDsContext((s) => s.activeOperation);
  const values          = useDsContext((s) => s.values);
  const targetValue     = useDsContext((s) => s.targetValue);
  const insertIndex     = useDsContext((s) => s.insertIndex);
  const deleteIndex     = useDsContext((s) => s.deleteIndex);
  const graphEdges      = useDsContext((s) => s.graphEdges);
  const startNode       = useDsContext((s) => s.startNode);
  const treeType        = useDsContext((s) => s.treeType);
  const setOperation    = useDsContext((s) => s.setOperation);
  const setValues       = useDsContext((s) => s.setValues);
  const setTargetValue  = useDsContext((s) => s.setTargetValue);
  const setInsertIndex  = useDsContext((s) => s.setInsertIndex);
  const setDeleteIndex  = useDsContext((s) => s.setDeleteIndex);
  const setGraphEdges   = useDsContext((s) => s.setGraphEdges);
  const setStartNode    = useDsContext((s) => s.setStartNode);
  const setTreeType     = useDsContext((s) => s.setTreeType);

  const setFrames = useStepStore((s) => s.setFrames);
  const play      = useStepStore((s) => s.play);

  const [localValues, setLocalValues] = useState(values.join(", "));
  const [localGraphEdges, setLocalGraphEdges] = useState(graphEdges.join(" "));

  useEffect(() => {
    setLocalValues(values.join(", "));
  }, [values]);

  useEffect(() => {
    setLocalGraphEdges(graphEdges.join(" "));
  }, [graphEdges]);

  const ops = STRUCTURE_OPERATIONS[activeStructure];

  const isGraph = activeStructure === "graph";
  const isTree = activeStructure === "binary-tree";

  const needsTarget = ["linear-search", "binary-search", "insert", "push", "enqueue",
    "insert-head", "insert-tail", "insert-bst"].includes(activeOperation);
  const needsInsertIndex = activeOperation === "insert";
  const needsDeleteIndex = ["delete", "delete-node"].includes(activeOperation);
  const needsTargetValueForTree = activeOperation === "insert-bst";

  const handleVisualize = () => {
    const parsedValues = localValues
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));
    
    const parsedEdges = localGraphEdges
      .split(/[\s,]+/)
      .filter((e) => e.includes("-") && e.split("-").length === 2)
      .map((e) => e.trim().toUpperCase());

    const frames = createFrames({
      structure: activeStructure,
      operation: activeOperation,
      values: parsedValues,
      targetValue,
      insertIndex,
      deleteIndex,
      graphEdges: parsedEdges,
      startNode,
      treeType,
    });

    setFrames(frames);
    play();
  };

  const getAvailableStartNodes = (): string[] => {
    const edges = localGraphEdges
      .split(/[\s,]+/)
      .filter((e) => e.includes("-") && e.split("-").length === 2)
      .map((e) => e.trim().toUpperCase());
    
    if (edges.length === 0) {
      return ["A", "B", "C", "D", "E"];
    }
    const nodes = new Set<string>();
    for (const edge of edges) {
      const parts = edge.split("-");
      if (parts.length === 2) {
        nodes.add(parts[0]);
        nodes.add(parts[1]);
      }
    }
    return Array.from(nodes).sort();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-lg p-4 space-y-3"
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Input
      </h3>

      {/* Operation selector */}
      <div className="space-y-1">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Operation
        </label>
        <div className="relative">
          <select
            value={activeOperation}
            onChange={(e) => setOperation(e.target.value as OperationKey)}
            className="w-full appearance-none bg-secondary text-foreground text-xs rounded-md px-3 py-2 pr-8
              border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
          >
            {ops.map((op) => (
              <option key={op} value={op}>
                {OPERATION_LABELS[op]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Tree Type selector */}
      {isTree && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Tree Type
          </label>
          <div className="relative">
            <select
              value={treeType}
              onChange={(e) => setTreeType(e.target.value as TreeType)}
              className="w-full appearance-none bg-secondary text-foreground text-xs rounded-md px-3 py-2 pr-8
                border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
            >
              {(Object.keys(TREE_TYPE_LABELS) as TreeType[]).map((tt) => (
                <option key={tt} value={tt}>
                  {TREE_TYPE_LABELS[tt]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}

      {/* Values input for non-graph structures */}
      {!isGraph && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Values {isTree && treeType === "bst" ? "(for BST insertion order)" : "(comma or space separated)"}
          </label>
          <input
            type="text"
            value={localValues}
            onChange={(e) => setLocalValues(e.target.value)}
            className="w-full bg-secondary text-foreground text-xs font-mono rounded-md px-3 py-2
              border border-transparent focus:border-primary focus:outline-none"
            placeholder={isTree ? "e.g. 50 30 70 20 40 60 80" : "e.g. 5 2 8 1 9 3"}
          />
        </div>
      )}

      {/* Graph edges input */}
      {isGraph && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Edges (undirected)
          </label>
          <input
            type="text"
            value={localGraphEdges}
            onChange={(e) => setLocalGraphEdges(e.target.value)}
            className="w-full bg-secondary text-foreground text-xs font-mono rounded-md px-3 py-2
              border border-transparent focus:border-primary focus:outline-none"
            placeholder="A-B B-C C-D D-E"
          />
        </div>
      )}

      {/* Start node selector for graph */}
      {isGraph && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Start Node
          </label>
          <div className="relative">
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="w-full appearance-none bg-secondary text-foreground text-xs rounded-md px-3 py-2 pr-8
                border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
            >
              {getAvailableStartNodes().map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}

      {/* Target value */}
      {needsTarget && !isGraph && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {needsTargetValueForTree ? "Value to Insert" : "Target / New Value"}
          </label>
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="w-full bg-secondary text-foreground text-xs font-mono rounded-md px-3 py-2
              border border-transparent focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {/* Insert index */}
      {needsInsertIndex && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Insert At Index
          </label>
          <input
            type="number"
            min={0}
            value={insertIndex}
            onChange={(e) => setInsertIndex(Number(e.target.value))}
            className="w-full bg-secondary text-foreground text-xs font-mono rounded-md px-3 py-2
              border border-transparent focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {/* Delete index */}
      {needsDeleteIndex && (
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Delete At Index
          </label>
          <input
            type="number"
            min={0}
            value={deleteIndex}
            onChange={(e) => setDeleteIndex(Number(e.target.value))}
            className="w-full bg-secondary text-foreground text-xs font-mono rounded-md px-3 py-2
              border border-transparent focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {/* Visualize button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleVisualize}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md
          bg-primary text-primary-foreground text-xs font-semibold glow-primary"
      >
        <Play className="w-3.5 h-3.5" />
        Visualize
      </motion.button>
    </motion.div>
  );
};

export default InputPanel;

import { create } from "zustand";
import type { StructureKey, OperationKey } from "../engine/types";

/** Human-readable label for the sidebar */
export const STRUCTURE_LABELS: Record<StructureKey, string> = {
  "array": "Array",
  "linked-list": "Linked List",
  "stack": "Stack",
  "queue": "Queue",
  "binary-tree": "Binary Tree",
  "graph": "Graph",
};

/** Default input values per structure - empty by default */
const DEFAULT_VALUES: Record<StructureKey, number[]> = {
  "array":       [],
  "linked-list": [],
  "stack":       [],
  "queue":       [],
  "binary-tree": [],
  "graph":       [],
};

/** Default edges for graph (as array of strings like "A-B") */
const DEFAULT_GRAPH_EDGES: string[] = [];

/** Tree types */
export type TreeType = "bst" | "binary";

/** Tree type labels */
export const TREE_TYPE_LABELS: Record<TreeType, string> = {
  "bst": "Binary Search Tree (BST)",
  "binary": "Binary Tree",
};

/** Available operations per structure */
export const STRUCTURE_OPERATIONS: Record<StructureKey, OperationKey[]> = {
  "array": [
    "traverse",
    "linear-search",
    "binary-search",
    "insert",
    "delete",
    "bubble-sort",
  ],
  "linked-list": ["insert-head", "insert-tail", "delete-node", "traverse"],
  "stack":       ["push", "pop", "peek"],
  "queue":       ["enqueue", "dequeue"],
  "binary-tree": ["inorder", "preorder", "postorder", "bfs", "insert-bst"],
  "graph":       ["dfs", "bfs"],
};

/** Operation display labels */
export const OPERATION_LABELS: Record<OperationKey, string> = {
  "traverse":     "Traverse",
  "linear-search":"Linear Search",
  "binary-search":"Binary Search",
  "insert":       "Insert",
  "delete":       "Delete",
  "bubble-sort":  "Bubble Sort",
  "insert-head":  "Insert Head",
  "insert-tail":  "Insert Tail",
  "delete-node":  "Delete Node",
  "push":         "Push",
  "pop":          "Pop",
  "peek":         "Peek",
  "enqueue":      "Enqueue",
  "dequeue":      "Dequeue",
  "inorder":      "Inorder",
  "preorder":     "Preorder",
  "postorder":    "Postorder",
  "bfs":          "BFS",
  "insert-bst":   "Insert (BST)",
  "dfs":          "DFS",
};

interface DsContextState {
  activeStructure: StructureKey;
  activeOperation: OperationKey;
  values: number[];
  targetValue: number;
  insertIndex: number;
  deleteIndex: number;
  graphEdges: string[];
  startNode: string;
  treeType: TreeType;

  // ── Actions ──────────────────────────────────────────────────────────
  setStructure: (s: StructureKey) => void;
  setOperation: (op: OperationKey) => void;
  setValues: (v: number[]) => void;
  setTargetValue: (v: number) => void;
  setInsertIndex: (i: number) => void;
  setDeleteIndex: (i: number) => void;
  setGraphEdges: (e: string[]) => void;
  setStartNode: (s: string) => void;
  setTreeType: (t: TreeType) => void;
}

export const useDsContext = create<DsContextState>()((set) => ({
  activeStructure: "array",
  activeOperation: "traverse",
  values: [...DEFAULT_VALUES["array"]],
  targetValue: 0,
  insertIndex: 0,
  deleteIndex: 0,
  graphEdges: [...DEFAULT_GRAPH_EDGES],
  startNode: "A",
  treeType: "bst",

  setStructure: (s) =>
    set({
      activeStructure: s,
      activeOperation: STRUCTURE_OPERATIONS[s][0],
      values: [...DEFAULT_VALUES[s]],
      graphEdges: s === "graph" ? [...DEFAULT_GRAPH_EDGES] : [],
      startNode: "A",
      treeType: s === "binary-tree" ? "bst" : "bst",
    }),

  setOperation: (op) => set({ activeOperation: op }),
  setValues:    (v)  => set({ values: v }),
  setTargetValue: (v) => set({ targetValue: v }),
  setInsertIndex: (i) => set({ insertIndex: i }),
  setDeleteIndex: (i) => set({ deleteIndex: i }),
  setGraphEdges: (e) => set({ graphEdges: e }),
  setStartNode: (s) => set({ startNode: s }),
  setTreeType: (t) => set({ treeType: t }),
}));

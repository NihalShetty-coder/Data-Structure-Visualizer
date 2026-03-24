// ─── Core Types for the DS Visualization Engine ────────────────────────────

/** Visual state of a node at any given step */
export type NodeState =
  | "idle"
  | "active"
  | "visited"
  | "comparing"
  | "inserting"
  | "deleting"
  | "found"
  | "pivot"
  | "sorted";

/** A node to be rendered on the canvas */
export interface DSNode {
  id: string;
  value: number | string;
  state: NodeState;
  /** Optional absolute position (for tree / graph) */
  x?: number;
  y?: number;
  /** Depth/level (used for tree layout) */
  level?: number;
}

/** A directed or undirected edge between two nodes */
export interface DSEdge {
  from: string; // DSNode.id
  to: string;   // DSNode.id
  label?: string;
  weight?: number;
  state?: "idle" | "active" | "visited";
}

/** Named pointer annotations (e.g. head, tail, top, current) */
export type Pointers = Record<string, string | null>; // name → node id or null

/**
 * A complete snapshot of the data structure at one algorithm step.
 * The array of frames is produced by an engine function and consumed
 * by the animation scheduler.
 */
export interface DSFrame {
  frameIndex: number;
  nodes: DSNode[];
  edges?: DSEdge[];
  pointers?: Pointers;
  /** 1-based line numbers in the pseudocode editor to highlight */
  highlightedLines: number[];
  /** Human-readable description shown in the log panel */
  logMessage: string;
}

/** Every supported data structure key */
export type StructureKey =
  | "array"
  | "linked-list"
  | "stack"
  | "queue"
  | "binary-tree"
  | "graph";

/** Every supported operation (union of all structures) */
export type OperationKey =
  // array
  | "traverse"
  | "linear-search"
  | "binary-search"
  | "insert"
  | "delete"
  | "bubble-sort"
  // linked list
  | "insert-head"
  | "insert-tail"
  | "delete-node"
  // stack
  | "push"
  | "pop"
  | "peek"
  // queue
  | "enqueue"
  | "dequeue"
  // tree
  | "inorder"
  | "preorder"
  | "postorder"
  | "bfs"
  | "insert-bst"
  // graph
  | "dfs";

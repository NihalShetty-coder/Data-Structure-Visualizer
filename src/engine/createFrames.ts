import type { DSFrame, StructureKey, OperationKey } from "./types";
import type { TreeType } from "../store/dsContext";

// ── Array ──────────────────────────────────────────────────────────────────
import {
  arrayTraverseFrames,
  arrayLinearSearchFrames,
  arrayBinarySearchFrames,
  arrayInsertFrames,
  arrayDeleteFrames,
  arrayBubbleSortFrames,
} from "./structures/array";

// ── Linked List ────────────────────────────────────────────────────────────
import {
  llInsertHeadFrames,
  llInsertTailFrames,
  llDeleteFrames,
  llTraverseFrames,
} from "./structures/linkedList";

// ── Stack ──────────────────────────────────────────────────────────────────
import {
  stackPushFrames,
  stackPopFrames,
  stackPeekFrames,
} from "./structures/stack";

// ── Queue ──────────────────────────────────────────────────────────────────
import {
  queueEnqueueFrames,
  queueDequeueFrames,
} from "./structures/queue";

// ── Binary Tree ────────────────────────────────────────────────────────────
import {
  treeInorderFrames,
  treePreorderFrames,
  treePostorderFrames,
  treeBfsFrames,
  treeInsertBSTFrames,
} from "./structures/binaryTree";

// ── Graph ──────────────────────────────────────────────────────────────────
import { graphDFSFrames, graphBFSFrames } from "./structures/graph";

export interface CreateFramesParams {
  structure: StructureKey;
  operation: OperationKey;
  /** Current elements in the structure */
  values: number[];
  /** For search/insert: the target / new value */
  targetValue?: number;
  /** For array insert: the index */
  insertIndex?: number;
  /** For array delete / linked-list delete: the index/value */
  deleteIndex?: number;
  /** For graph: edge list (e.g., ["A-B", "B-C"]) */
  graphEdges?: string[];
  /** For graph: starting node */
  startNode?: string;
  /** For tree: tree type (bst or binary) */
  treeType?: TreeType;
}

/**
 * Central dispatcher — given a structure + operation + data it returns
 * the full animation frame sequence.
 */
export function createFrames(params: CreateFramesParams): DSFrame[] {
  const {
    structure,
    operation,
    values,
    targetValue = 0,
    insertIndex = 0,
    deleteIndex = 0,
    graphEdges = [],
    startNode = "A",
    treeType = "bst",
  } = params;

  // ── Array ────────────────────────────────────────────────────────────────
  if (structure === "array") {
    switch (operation) {
      case "traverse":    return arrayTraverseFrames(values);
      case "linear-search": return arrayLinearSearchFrames(values, targetValue);
      case "binary-search": return arrayBinarySearchFrames(values, targetValue);
      case "insert":      return arrayInsertFrames(values, insertIndex, targetValue);
      case "delete":      return arrayDeleteFrames(values, deleteIndex);
      case "bubble-sort": return arrayBubbleSortFrames(values);
    }
  }

  // ── Linked List ──────────────────────────────────────────────────────────
  if (structure === "linked-list") {
    switch (operation) {
      case "insert-head": return llInsertHeadFrames(values, targetValue);
      case "insert-tail": return llInsertTailFrames(values, targetValue);
      case "delete-node": return llDeleteFrames(values, deleteIndex);
      case "traverse":    return llTraverseFrames(values);
    }
  }

  // ── Stack ────────────────────────────────────────────────────────────────
  if (structure === "stack") {
    switch (operation) {
      case "push": return stackPushFrames(values, targetValue);
      case "pop":  return stackPopFrames(values);
      case "peek": return stackPeekFrames(values);
    }
  }

  // ── Queue ────────────────────────────────────────────────────────────────
  if (structure === "queue") {
    switch (operation) {
      case "enqueue": return queueEnqueueFrames(values, targetValue);
      case "dequeue": return queueDequeueFrames(values);
    }
  }

  // ── Binary Tree ──────────────────────────────────────────────────────────
  if (structure === "binary-tree") {
    switch (operation) {
      case "inorder":    return treeInorderFrames(values, treeType);
      case "preorder":   return treePreorderFrames(values, treeType);
      case "postorder":  return treePostorderFrames(values, treeType);
      case "bfs":        return treeBfsFrames(values, treeType);
      case "insert-bst": return treeInsertBSTFrames(values, targetValue, treeType);
    }
  }

  // ── Graph ────────────────────────────────────────────────────────────────
  if (structure === "graph") {
    switch (operation) {
      case "dfs": return graphDFSFrames(graphEdges, startNode);
      case "bfs": return graphBFSFrames(graphEdges, startNode);
    }
  }

  // Fallback
  return [
    {
      frameIndex: 0,
      nodes: [],
      highlightedLines: [],
      logMessage: `No frames for ${structure} / ${operation}.`,
    },
  ];
}

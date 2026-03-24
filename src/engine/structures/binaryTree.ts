import type { DSFrame, DSNode, DSEdge } from "../types";
import type { TreeType } from "../../store/dsContext";

interface TNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  depth: number;
  x: number;
  y: number;
}

function buildTree(values: number[], treeType: TreeType): TNode[] {
  if (values.length === 0) return [];
  
  const nodes: TNode[] = [];
  
  if (treeType === "bst") {
    let counter = 0;
    const insert = (val: number, id: string | null, depth: number, xMin: number, xMax: number): string => {
      const newId = `t${counter++}`;
      const x = (xMin + xMax) / 2;
      const y = 60 + depth * 80;

      if (!id) {
        nodes.push({ id: newId, value: val, left: null, right: null, depth, x, y });
        return newId;
      }

      const node = nodes.find((n) => n.id === id)!;
      if (val < node.value) {
        if (!node.left) {
          const childId = insert(val, null, depth + 1, xMin, x);
          node.left = childId;
        } else {
          insert(val, node.left, depth + 1, xMin, x);
        }
      } else {
        if (!node.right) {
          const childId = insert(val, null, depth + 1, x, xMax);
          node.right = childId;
        } else {
          insert(val, node.right, depth + 1, x, xMax);
        }
      }
      return id;
    };

    let root: string | null = null;
    for (const v of values) {
      root = insert(v, root, 0, 0, 600);
    }
  } else {
    for (let i = 0; i < values.length; i++) {
      const depth = Math.floor(Math.log2(i + 1));
      const levelStart = Math.pow(2, depth) - 1;
      const levelWidth = Math.pow(2, depth);
      const posInLevel = i - levelStart;
      const totalWidth = 600;
      const spacing = totalWidth / (levelWidth + 1);
      const x = spacing * (posInLevel + 1);
      const y = 60 + depth * 80;
      
      nodes.push({
        id: `t${i}`,
        value: values[i],
        left: (2 * i + 1) < values.length ? `t${2 * i + 1}` : null,
        right: (2 * i + 2) < values.length ? `t${2 * i + 2}` : null,
        depth,
        x,
        y,
      });
    }
  }
  
  return nodes;
}

const toFrame = (
  nodes: TNode[],
  stateMap: Record<string, DSNode["state"]>,
  highlightedLines: number[],
  logMessage: string,
  frameIndex: number
): DSFrame => {
  const dsNodes: DSNode[] = nodes.map((n) => ({
    id: n.id,
    value: n.value,
    state: stateMap[n.id] ?? "idle",
    x: n.x,
    y: n.y,
  }));

  const edges: DSEdge[] = [];
  for (const n of nodes) {
    if (n.left) edges.push({ from: n.id, to: n.left });
    if (n.right) edges.push({ from: n.id, to: n.right });
  }

  return { frameIndex, nodes: dsNodes, edges, highlightedLines, logMessage };
};

export function treeInorderFrames(values: number[], treeType: TreeType = "bst"): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildTree(values, treeType);
  const visited: Record<string, DSNode["state"]> = {};

  frames.push(toFrame(nodes, {}, [1], "Starting in-order traversal (left → root → right)…", frames.length));

  const inorder = (id: string | null) => {
    if (!id) return;
    const n = nodes.find((x) => x.id === id)!;
    inorder(n.left);
    visited[id] = "visited";
    frames.push(
      toFrame(nodes, { ...visited, [id]: "active" }, [2, 3], `Visit node: ${n.value}`, frames.length)
    );
    inorder(n.right);
  };

  inorder(nodes[0]?.id ?? null);
  frames.push(toFrame(nodes, visited, [5], "In-order traversal complete!", frames.length));
  return frames;
}

export function treePreorderFrames(values: number[], treeType: TreeType = "bst"): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildTree(values, treeType);
  const visited: Record<string, DSNode["state"]> = {};

  frames.push(toFrame(nodes, {}, [1], "Starting pre-order traversal (root → left → right)…", frames.length));

  const preorder = (id: string | null) => {
    if (!id) return;
    const n = nodes.find((x) => x.id === id)!;
    visited[id] = "visited";
    frames.push(toFrame(nodes, { ...visited, [id]: "active" }, [2, 3], `Visit node: ${n.value}`, frames.length));
    preorder(n.left);
    preorder(n.right);
  };

  preorder(nodes[0]?.id ?? null);
  frames.push(toFrame(nodes, visited, [5], "Pre-order traversal complete!", frames.length));
  return frames;
}

export function treePostorderFrames(values: number[], treeType: TreeType = "bst"): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildTree(values, treeType);
  const visited: Record<string, DSNode["state"]> = {};

  frames.push(toFrame(nodes, {}, [1], "Starting post-order traversal (left → right → root)…", frames.length));

  const postorder = (id: string | null) => {
    if (!id) return;
    const n = nodes.find((x) => x.id === id)!;
    postorder(n.left);
    postorder(n.right);
    visited[id] = "visited";
    frames.push(toFrame(nodes, { ...visited, [id]: "active" }, [2, 3], `Visit node: ${n.value}`, frames.length));
  };

  postorder(nodes[0]?.id ?? null);
  frames.push(toFrame(nodes, visited, [5], "Post-order traversal complete!", frames.length));
  return frames;
}

export function treeBfsFrames(values: number[], treeType: TreeType = "bst"): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildTree(values, treeType);
  const visited: Record<string, DSNode["state"]> = {};

  frames.push(toFrame(nodes, {}, [1], "Starting BFS (level-order) traversal…", frames.length));

  const queue: string[] = nodes[0] ? [nodes[0].id] : [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const n = nodes.find((x) => x.id === id)!;
    visited[id] = "visited";
    frames.push(toFrame(nodes, { ...visited, [id]: "active" }, [3, 4], `Visit: ${n.value}`, frames.length));
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }

  frames.push(toFrame(nodes, visited, [7], "BFS complete!", frames.length));
  return frames;
}

export function treeInsertBSTFrames(values: number[], newValue: number, treeType: TreeType = "bst"): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildTree(values, treeType);

  frames.push(toFrame(nodes, {}, [1], `Inserting ${newValue} into ${treeType === "bst" ? "BST" : "Binary Tree"}…`, frames.length));

  let cur: string | null = nodes[0]?.id ?? null;
  while (cur) {
    const n = nodes.find((x) => x.id === cur)!;
    frames.push(
      toFrame(nodes, { [cur]: "comparing" }, [2, 3], `Compare ${newValue} with ${n.value}`, frames.length)
    );
    if (treeType === "bst") {
      if (newValue < n.value) {
        cur = n.left;
      } else {
        cur = n.right;
      }
    } else {
      if (!n.left) {
        cur = null;
      } else if (!n.right) {
        cur = n.right;
      } else {
        cur = null;
      }
    }
  }

  const updated = buildTree([...values, newValue], treeType);
  const newNodeId = `t${updated.length - 1}`;
  frames.push(
    toFrame(updated, { [newNodeId]: "inserting" }, [5], `Inserted ${newValue}!`, frames.length)
  );
  return frames;
}

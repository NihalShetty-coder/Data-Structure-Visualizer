import type { DSFrame, DSNode, DSEdge } from "../types";

// ─── Adjacency list representation ────────────────────────────────────────
type AdjList = Record<string, string[]>;

// Default sample graph for when no custom input is given
const DEFAULT_EDGES = ["A-B", "B-C", "C-D", "D-E", "A-C", "B-D"];

function parseEdges(edgeStrings: string[]): AdjList {
  const adj: AdjList = {};
  
  for (const edgeStr of edgeStrings) {
    const parts = edgeStr.split("-");
    if (parts.length !== 2) continue;
    
    const [from, to] = parts.map(s => s.trim().toUpperCase());
    if (!from || !to) continue;
    
    if (!adj[from]) adj[from] = [];
    if (!adj[to]) adj[to] = [];
    
    if (!adj[from].includes(to)) adj[from].push(to);
    if (!adj[to].includes(from)) adj[to].push(from);
  }
  
  return adj;
}

// Arrange nodes in a circle
const circlePositions = (ids: string[], cx = 300, cy = 200, r = 120): Record<string, { x: number; y: number }> => {
  const pos: Record<string, { x: number; y: number }> = {};
  ids.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2;
    pos[id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return pos;
};

const toFrame = (
  ids: string[],
  adj: AdjList,
  pos: Record<string, { x: number; y: number }>,
  stateMap: Record<string, DSNode["state"]>,
  edgeActive: Set<string>,
  highlightedLines: number[],
  logMessage: string,
  frameIndex: number
): DSFrame => {
  const nodes: DSNode[] = ids.map((id) => ({
    id,
    value: id,
    state: stateMap[id] ?? "idle",
    x: pos[id].x,
    y: pos[id].y,
  }));

  const edgeSet = new Set<string>();
  const edges: DSEdge[] = [];
  for (const from of ids) {
    for (const to of adj[from] ?? []) {
      const key = [from, to].sort().join("-");
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        const eKey = `${from}-${to}`;
        const eKey2 = `${to}-${from}`;
        edges.push({
          from,
          to,
          state: edgeActive.has(eKey) || edgeActive.has(eKey2) ? "active" : "idle",
        });
      }
    }
  }

  return { frameIndex, nodes, edges, highlightedLines, logMessage };
};

// ── DFS ────────────────────────────────────────────────────────────────────
export function graphDFSFrames(edgeStrings: string[] = DEFAULT_EDGES, startNode = "A"): DSFrame[] {
  const frames: DSFrame[] = [];
  const edges = edgeStrings.length > 0 ? edgeStrings : DEFAULT_EDGES;
  const adj = parseEdges(edges);
  const ids = Object.keys(adj);
  
  if (ids.length === 0) {
    return [{ frameIndex: 0, nodes: [], edges: [], highlightedLines: [], logMessage: "No nodes in graph" }];
  }
  
  const validStartNode = ids.includes(startNode) ? startNode : ids[0];
  const pos = circlePositions(ids);
  const visited: Record<string, DSNode["state"]> = {};
  const activeEdges = new Set<string>();

  frames.push(
    toFrame(ids, adj, pos, {}, activeEdges, [1], `Starting DFS from node ${validStartNode}…`, frames.length)
  );

  const dfs = (node: string) => {
    visited[node] = "visited";
    frames.push(
      toFrame(ids, adj, pos, { ...visited, [node]: "active" }, new Set(activeEdges), [3], `Visiting node ${node}`, frames.length)
    );

    for (const neighbor of adj[node] ?? []) {
      if (!(neighbor in visited)) {
        activeEdges.add(`${node}-${neighbor}`);
        frames.push(
          toFrame(ids, adj, pos, { ...visited, [node]: "active", [neighbor]: "comparing" }, new Set(activeEdges), [5, 6], `Exploring edge ${node} → ${neighbor}`, frames.length)
        );
        dfs(neighbor);
        activeEdges.delete(`${node}-${neighbor}`);
      }
    }
  };

  dfs(validStartNode);

  frames.push(toFrame(ids, adj, pos, visited, new Set(), [9], "DFS complete! All reachable nodes visited.", frames.length));
  return frames;
}

// ── BFS on graph ───────────────────────────────────────────────────────────
export function graphBFSFrames(edgeStrings: string[] = DEFAULT_EDGES, startNode = "A"): DSFrame[] {
  const frames: DSFrame[] = [];
  const edges = edgeStrings.length > 0 ? edgeStrings : DEFAULT_EDGES;
  const adj = parseEdges(edges);
  const ids = Object.keys(adj);
  
  if (ids.length === 0) {
    return [{ frameIndex: 0, nodes: [], edges: [], highlightedLines: [], logMessage: "No nodes in graph" }];
  }
  
  const validStartNode = ids.includes(startNode) ? startNode : ids[0];
  const pos = circlePositions(ids);
  const visited: Record<string, DSNode["state"]> = {};
  const activeEdges = new Set<string>();

  frames.push(toFrame(ids, adj, pos, {}, activeEdges, [1], `Starting BFS from node ${validStartNode}…`, frames.length));

  const queue = [validStartNode];
  visited[validStartNode] = "visited";

  while (queue.length > 0) {
    const node = queue.shift()!;
    frames.push(
      toFrame(ids, adj, pos, { ...visited, [node]: "active" }, new Set(activeEdges), [3, 4], `Dequeued ${node}`, frames.length)
    );

    for (const neighbor of adj[node] ?? []) {
      if (!(neighbor in visited)) {
        visited[neighbor] = "visited";
        activeEdges.add(`${node}-${neighbor}`);
        queue.push(neighbor);
        frames.push(
          toFrame(ids, adj, pos, { ...visited, [node]: "active", [neighbor]: "comparing" }, new Set(activeEdges), [6, 7], `Enqueue neighbor ${neighbor}`, frames.length)
        );
      }
    }
  }

  frames.push(toFrame(ids, adj, pos, visited, new Set(), [10], "BFS complete!", frames.length));
  return frames;
}

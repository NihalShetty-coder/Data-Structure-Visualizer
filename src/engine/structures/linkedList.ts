import type { DSFrame, DSNode, DSEdge } from "../types";

// ─── Linked List Node ──────────────────────────────────────────────────────
interface LLNode {
  id: string;
  value: number;
  next: string | null;
}

const buildLLFromValues = (values: number[]): LLNode[] =>
  values.map((v, i) => ({
    id: `n${i}`,
    value: v,
    next: i < values.length - 1 ? `n${i + 1}` : null,
  }));

const llToFrame = (
  nodes: LLNode[],
  stateMap: Record<string, DSNode["state"]>,
  highlightedLines: number[],
  logMessage: string,
  frameIndex: number,
  pointers?: Record<string, string | null>
): DSFrame => {
  const dsNodes: DSNode[] = nodes.map((n, i) => ({
    id: n.id,
    value: n.value,
    state: stateMap[n.id] ?? "idle",
    x: 80 + i * 110,
    y: 120,
  }));

  const edges: DSEdge[] = nodes
    .filter((n) => n.next !== null)
    .map((n) => ({ from: n.id, to: n.next!, state: "idle" }));

  return { frameIndex, nodes: dsNodes, edges, pointers, highlightedLines, logMessage };
};

// ── Traverse ────────────────────────────────────────────────────────────────
export function llTraverseFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildLLFromValues(values);

  frames.push(llToFrame(nodes, {}, [1, 2], "Starting traversal from head…", frames.length, { current: nodes[0]?.id ?? null }));

  for (let i = 0; i < nodes.length; i++) {
    frames.push(
      llToFrame(nodes, { [nodes[i].id]: "active" }, [3], `Visiting node ${i}: value = ${nodes[i].value}`, frames.length, {
        current: nodes[i].id,
      })
    );
  }

  frames.push(llToFrame(nodes, {}, [5], "Traversal complete (reached null).", frames.length, { current: null }));
  return frames;
}

// ── Insert Head ─────────────────────────────────────────────────────────────
export function llInsertHeadFrames(values: number[], newValue: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildLLFromValues(values);

  frames.push(llToFrame(nodes, {}, [1], `Inserting ${newValue} at head…`, frames.length));

  const newNode: LLNode = { id: "new", value: newValue, next: nodes[0]?.id ?? null };
  const withNew = [newNode, ...nodes];

  frames.push(
    llToFrame(withNew, { new: "inserting" }, [2, 3], `New node created with value ${newValue}`, frames.length, {
      head: "new",
    })
  );

  frames.push(llToFrame(withNew, { new: "active" }, [4], "New node is now the head.", frames.length, { head: "new" }));
  return frames;
}

// ── Insert Tail ─────────────────────────────────────────────────────────────
export function llInsertTailFrames(values: number[], newValue: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildLLFromValues(values);

  frames.push(llToFrame(nodes, {}, [1], `Inserting ${newValue} at tail…`, frames.length));

  for (let i = 0; i < nodes.length; i++) {
    frames.push(
      llToFrame(nodes, { [nodes[i].id]: "active" }, [2, 3], `Traversing to find tail… at node ${i}`, frames.length, {
        current: nodes[i].id,
        tail: nodes[nodes.length - 1].id,
      })
    );
  }

  const newNode: LLNode = { id: `n${nodes.length}`, value: newValue, next: null };
  if (nodes.length > 0) nodes[nodes.length - 1].next = newNode.id;
  const withNew = [...nodes, newNode];

  frames.push(
    llToFrame(withNew, { [newNode.id]: "inserting" }, [4, 5], `Appended ${newValue} as new tail.`, frames.length, {
      tail: newNode.id,
    })
  );
  return frames;
}

// ── Delete by Value ──────────────────────────────────────────────────────────
export function llDeleteFrames(values: number[], target: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const nodes = buildLLFromValues(values);

  frames.push(llToFrame(nodes, {}, [1], `Deleting node with value ${target}…`, frames.length));

  let found = false;
  for (let i = 0; i < nodes.length; i++) {
    frames.push(
      llToFrame(nodes, { [nodes[i].id]: "comparing" }, [2, 3], `Checking node ${i}: value = ${nodes[i].value}`, frames.length)
    );

    if (nodes[i].value === target) {
      frames.push(
        llToFrame(nodes, { [nodes[i].id]: "deleting" }, [4], `Found ${target} at node ${i}, removing…`, frames.length)
      );

      nodes.splice(i, 1);
      // Re-link
      nodes.forEach((n, idx) => {
        n.id = `n${idx}`;
        n.next = idx < nodes.length - 1 ? `n${idx + 1}` : null;
      });

      frames.push(llToFrame(nodes, {}, [5], `Node deleted. List length: ${nodes.length}.`, frames.length));
      found = true;
      break;
    }
  }

  if (!found) {
    frames.push(llToFrame(nodes, {}, [7], `Value ${target} not found in list.`, frames.length));
  }

  return frames;
}

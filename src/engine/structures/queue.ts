import type { DSFrame, DSNode } from "../types";

// Queue rendered horizontally; index 0 = front
const makeNodes = (queue: number[], stateMap: Record<number, DSNode["state"]> = {}): DSNode[] =>
  queue.map((v, i) => ({
    id: String(i),
    value: v,
    state: stateMap[i] ?? "idle",
    x: 60 + i * 90,
    y: 120,
  }));

// ── Enqueue ──────────────────────────────────────────────────────────────────
export function queueEnqueueFrames(values: number[], newValue: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const queue = [...values];

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue),
    highlightedLines: [1],
    logMessage: `Enqueueing ${newValue} at the rear…`,
    pointers: { front: "0", rear: String(queue.length - 1) },
  });

  queue.push(newValue);

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue, { [queue.length - 1]: "inserting" }),
    highlightedLines: [2, 3],
    logMessage: `${newValue} enqueued. Queue size: ${queue.length}.`,
    pointers: { front: "0", rear: String(queue.length - 1) },
  });

  return frames;
}

// ── Dequeue ──────────────────────────────────────────────────────────────────
export function queueDequeueFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const queue = [...values];

  if (queue.length === 0) {
    return [
      {
        frameIndex: 0,
        nodes: [],
        highlightedLines: [5],
        logMessage: "Queue is empty — cannot dequeue!",
      },
    ];
  }

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue, { 0: "active" }),
    highlightedLines: [6, 7],
    logMessage: `Front element: ${queue[0]}. Dequeuing…`,
    pointers: { front: "0", rear: String(queue.length - 1) },
  });

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue, { 0: "deleting" }),
    highlightedLines: [8],
    logMessage: `Removing ${queue[0]} from front…`,
    pointers: { front: "0" },
  });

  const dequeued = queue.shift()!;
  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue),
    highlightedLines: [9],
    logMessage: `Dequeued: ${dequeued}. Queue size: ${queue.length}.`,
    pointers: { front: queue.length > 0 ? "0" : null, rear: queue.length > 0 ? String(queue.length - 1) : null },
  });

  return frames;
}

// ── Peek Front ──────────────────────────────────────────────────────────────
export function queuePeekFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const queue = [...values];

  if (queue.length === 0) {
    return [
      {
        frameIndex: 0,
        nodes: [],
        highlightedLines: [12],
        logMessage: "Queue is empty — nothing to peek!",
      },
    ];
  }

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue),
    highlightedLines: [12],
    logMessage: "Peek at front element…",
    pointers: { front: "0" },
  });

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(queue, { 0: "active" }),
    highlightedLines: [13],
    logMessage: `Front element: ${queue[0]} (not removed).`,
    pointers: { front: "0" },
  });

  return frames;
}

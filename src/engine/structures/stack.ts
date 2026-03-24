import type { DSFrame, DSNode } from "../types";

// Stack rendered as a vertical column; index 0 = bottom, last = top
const makeNodes = (stack: number[], activeIdx?: number): DSNode[] =>
  stack.map((v, i) => ({
    id: String(i),
    value: v,
    state: i === activeIdx ? "active" : "idle",
    x: 160,
    y: 300 - i * 60,
  }));

// ── Push ─────────────────────────────────────────────────────────────────────
export function stackPushFrames(values: number[], newValue: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const stack = [...values];

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack),
    highlightedLines: [1],
    logMessage: `Push ${newValue} onto stack…`,
    pointers: { top: stack.length > 0 ? String(stack.length - 1) : null },
  });

  stack.push(newValue);

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack, stack.length - 1),
    highlightedLines: [2, 3],
    logMessage: `${newValue} pushed. Stack size: ${stack.length}.`,
    pointers: { top: String(stack.length - 1) },
  });

  return frames;
}

// ── Pop ──────────────────────────────────────────────────────────────────────
export function stackPopFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const stack = [...values];

  if (stack.length === 0) {
    return [
      {
        frameIndex: 0,
        nodes: [],
        highlightedLines: [5],
        logMessage: "Stack is empty — cannot pop!",
      },
    ];
  }

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack, stack.length - 1),
    highlightedLines: [7, 8],
    logMessage: `Popping top element: ${stack[stack.length - 1]}…`,
    pointers: { top: String(stack.length - 1) },
  });

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack, stack.length - 1).map((n, i) =>
      i === stack.length - 1 ? { ...n, state: "deleting" } : n
    ),
    highlightedLines: [9],
    logMessage: `Removing ${stack[stack.length - 1]} from stack…`,
    pointers: { top: String(stack.length - 1) },
  });

  const popped = stack.pop()!;
  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack),
    highlightedLines: [10],
    logMessage: `Popped: ${popped}. Stack size: ${stack.length}.`,
    pointers: { top: stack.length > 0 ? String(stack.length - 1) : null },
  });

  return frames;
}

// ── Peek ─────────────────────────────────────────────────────────────────────
export function stackPeekFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const stack = [...values];

  if (stack.length === 0) {
    return [
      {
        frameIndex: 0,
        nodes: [],
        highlightedLines: [12],
        logMessage: "Stack is empty — nothing to peek!",
      },
    ];
  }

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack),
    highlightedLines: [12],
    logMessage: "Peek at top element…",
    pointers: { top: String(stack.length - 1) },
  });

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(stack, stack.length - 1),
    highlightedLines: [13],
    logMessage: `Top of stack: ${stack[stack.length - 1]} (not removed).`,
    pointers: { top: String(stack.length - 1) },
  });

  return frames;
}

import type { DSFrame, DSNode } from "../types";

// ─── Pseudocode lines (1-indexed) ──────────────────────────────────────────
// 1:  function traverse(arr)
// 2:    for i = 0 to arr.length - 1
// 3:      visit(arr[i])
// 4:    end for
// 5:  end function
// ────────────────────────────────────────────────────────────────────────────
// 6:  function linearSearch(arr, target)
// 7:    for i = 0 to arr.length - 1
// 8:      if arr[i] == target
// 9:        return i
// 10:   end if
// 11: end for
// 12: return -1
// ────────────────────────────────────────────────────────────────────────────
// 13: function insert(arr, index, value)
// 14:   for i = arr.length downto index + 1
// 15:     arr[i] = arr[i - 1]
// 16:   end for
// 17:   arr[index] = value
// ────────────────────────────────────────────────────────────────────────────
// 18: function delete(arr, index)
// 19:   for i = index to arr.length - 2
// 20:     arr[i] = arr[i + 1]
// 21:   end for
// 22:   arr.length--

const makeNodes = (values: number[], states: Record<number, DSNode["state"]> = {}): DSNode[] =>
  values.map((v, i) => ({
    id: String(i),
    value: v,
    state: states[i] ?? "idle",
  }));

// ── Traverse ────────────────────────────────────────────────────────────────
export function arrayTraverseFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const arr = [...values];

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr),
    highlightedLines: [1],
    logMessage: "Starting traversal…",
  });

  for (let i = 0; i < arr.length; i++) {
    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(arr, { [i]: "active" }),
      highlightedLines: [2, 3],
      logMessage: `Visiting index ${i} → value ${arr[i]}`,
    });
  }

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr, Object.fromEntries(arr.map((_, i) => [i, "visited"]))),
    highlightedLines: [4],
    logMessage: "Traversal complete.",
  });

  return frames;
}

// ── Linear Search ────────────────────────────────────────────────────────────
export function arrayLinearSearchFrames(values: number[], target: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const arr = [...values];

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr),
    highlightedLines: [6],
    logMessage: `Searching for ${target}…`,
  });

  let found = false;
  for (let i = 0; i < arr.length; i++) {
    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(arr, { [i]: "comparing" }),
      highlightedLines: [7, 8],
      logMessage: `Comparing index ${i}: ${arr[i]} == ${target}?`,
    });

    if (arr[i] === target) {
      frames.push({
        frameIndex: frames.length,
        nodes: makeNodes(arr, { [i]: "found" }),
        highlightedLines: [9],
        logMessage: `Found ${target} at index ${i}!`,
      });
      found = true;
      break;
    }
  }

  if (!found) {
    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(arr),
      highlightedLines: [12],
      logMessage: `${target} not found in array.`,
    });
  }

  return frames;
}

// ── Binary Search ────────────────────────────────────────────────────────────
export function arrayBinarySearchFrames(values: number[], target: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const arr = [...values].sort((a, b) => a - b);

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr),
    highlightedLines: [6],
    logMessage: `Binary searching for ${target} in sorted array…`,
  });

  let lo = 0, hi = arr.length - 1;
  let found = false;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const states: Record<number, DSNode["state"]> = {};
    for (let i = lo; i <= hi; i++) states[i] = "idle";
    states[mid] = "comparing";

    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(arr, states),
      highlightedLines: [7, 8],
      logMessage: `mid=${mid}, arr[mid]=${arr[mid]}, lo=${lo}, hi=${hi}`,
    });

    if (arr[mid] === target) {
      frames.push({
        frameIndex: frames.length,
        nodes: makeNodes(arr, { [mid]: "found" }),
        highlightedLines: [9],
        logMessage: `Found ${target} at index ${mid}!`,
      });
      found = true;
      break;
    } else if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (!found) {
    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(arr),
      highlightedLines: [12],
      logMessage: `${target} not found (binary search).`,
    });
  }

  return frames;
}

// ── Insert ─────────────────────────────────────────────────────────────────
export function arrayInsertFrames(values: number[], index: number, newValue: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const arr = [...values];
  const insertAt = Math.max(0, Math.min(index, arr.length));

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr, { [insertAt]: "active" }),
    highlightedLines: [13],
    logMessage: `Inserting ${newValue} at index ${insertAt}…`,
  });

  // Shift right
  const shifting = [...arr];
  for (let i = shifting.length; i > insertAt; i--) {
    const s: Record<number, DSNode["state"]> = {};
    s[i] = "comparing";
    s[i - 1] = "active";
    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(shifting, s),
      highlightedLines: [14, 15],
      logMessage: `Shifting arr[${i - 1}] → arr[${i}]`,
    });
  }

  arr.splice(insertAt, 0, newValue);
  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr, { [insertAt]: "inserting" }),
    highlightedLines: [17],
    logMessage: `Inserted ${newValue} at index ${insertAt}.`,
  });

  return frames;
}

// ── Delete ─────────────────────────────────────────────────────────────────
export function arrayDeleteFrames(values: number[], index: number): DSFrame[] {
  const frames: DSFrame[] = [];
  const arr = [...values];
  const deleteAt = Math.max(0, Math.min(index, arr.length - 1));

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr, { [deleteAt]: "deleting" }),
    highlightedLines: [18],
    logMessage: `Deleting element at index ${deleteAt} (value: ${arr[deleteAt]})…`,
  });

  const deleted = [...arr];
  for (let i = deleteAt; i < deleted.length - 1; i++) {
    const s: Record<number, DSNode["state"]> = {};
    s[i] = "active";
    s[i + 1] = "comparing";
    frames.push({
      frameIndex: frames.length,
      nodes: makeNodes(deleted, s),
      highlightedLines: [19, 20],
      logMessage: `Shifting arr[${i + 1}] → arr[${i}]`,
    });
  }

  arr.splice(deleteAt, 1);
  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr),
    highlightedLines: [21],
    logMessage: `Element deleted. Array length is now ${arr.length}.`,
  });

  return frames;
}

// ── Bubble Sort ─────────────────────────────────────────────────────────────
export function arrayBubbleSortFrames(values: number[]): DSFrame[] {
  const frames: DSFrame[] = [];
  const arr = [...values];
  const n = arr.length;

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr),
    highlightedLines: [1],
    logMessage: "Starting bubble sort…",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const s: Record<number, DSNode["state"]> = {};
      for (let k = n - i; k < n; k++) s[k] = "sorted";
      s[j] = "comparing";
      s[j + 1] = "comparing";

      frames.push({
        frameIndex: frames.length,
        nodes: makeNodes(arr, s),
        highlightedLines: [7, 8],
        logMessage: `Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        const s2: Record<number, DSNode["state"]> = {};
        for (let k = n - i; k < n; k++) s2[k] = "sorted";
        s2[j] = "active";
        s2[j + 1] = "active";
        frames.push({
          frameIndex: frames.length,
          nodes: makeNodes(arr, s2),
          highlightedLines: [14, 15],
          logMessage: `Swapped arr[${j}] and arr[${j + 1}]`,
        });
      }
    }
  }

  frames.push({
    frameIndex: frames.length,
    nodes: makeNodes(arr, Object.fromEntries(arr.map((_, i) => [i, "sorted"]))),
    highlightedLines: [4],
    logMessage: "Array is sorted!",
  });

  return frames;
}

import { motion } from "framer-motion";

const codeSnippets: Record<string, string[]> = {
  array: [
    "const arr = [42, 17, 8, 31, 56, 23];",
    "",
    "// Visualizing array traversal",
    "for (let i = 0; i < arr.length; i++) {",
    "  highlight(arr[i]);",
    "  await sleep(delay);",
    "}",
  ],
  "linked-list": [
    "class Node {",
    "  constructor(val) {",
    "    this.val = val;",
    "    this.next = null;",
    "  }",
    "}",
    "",
    "let current = head;",
    "while (current !== null) {",
    "  visit(current);",
    "  current = current.next;",
    "}",
  ],
  stack: [
    "const stack = [];",
    "",
    "stack.push(10);",
    "stack.push(20);",
    "stack.push(30);",
    "",
    "const top = stack.pop(); // 30",
    "highlight(top);",
  ],
  queue: [
    "const queue = [];",
    "",
    "queue.push('A');",
    "queue.push('B');",
    "queue.push('C');",
    "",
    "const front = queue.shift(); // 'A'",
    "process(front);",
  ],
  "binary-tree": [
    "function inorder(node) {",
    "  if (!node) return;",
    "  inorder(node.left);",
    "  visit(node);",
    "  inorder(node.right);",
    "}",
    "",
    "inorder(root);",
  ],
  graph: [
    "function bfs(start) {",
    "  const queue = [start];",
    "  const visited = new Set();",
    "",
    "  while (queue.length > 0) {",
    "    const node = queue.shift();",
    "    visited.add(node);",
    "    visit(node);",
    "  }",
    "}",
  ],
};

const CodeEditorMock = ({ structure }: { structure: string }) => {
  const lines = codeSnippets[structure] || codeSnippets.array;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-2 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="text-[10px] text-muted-foreground ml-2 font-mono">
          {structure}.ts
        </span>
      </div>
      <div className="p-3 overflow-x-auto">
        <pre className="text-[11px] leading-5 font-mono">
          {lines.map((line, i) => (
            <motion.div
              key={`${structure}-${i}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              className="flex"
            >
              <span className="w-6 text-right mr-4 text-muted-foreground/40 select-none">
                {i + 1}
              </span>
              <span className="text-secondary-foreground">
                {colorize(line)}
              </span>
            </motion.div>
          ))}
        </pre>
      </div>
    </motion.div>
  );
};

function colorize(line: string): JSX.Element {
  // Simple keyword highlighting
  const keywords = /\b(const|let|var|function|class|constructor|return|if|while|for|new|null|await)\b/g;
  const strings = /('[^']*'|"[^"]*")/g;
  const comments = /(\/\/.*$)/;
  const numbers = /\b(\d+)\b/g;

  if (comments.test(line)) {
    const parts = line.split(/(\/\/.*$)/);
    return (
      <>
        <span>{colorize(parts[0])}</span>
        <span className="text-muted-foreground italic">{parts[1]}</span>
      </>
    );
  }

  const parts = line.split(/(\b(?:const|let|var|function|class|constructor|return|if|while|for|new|null|await)\b|'[^']*'|"[^"]*"|\b\d+\b)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.test(part)) {
          keywords.lastIndex = 0;
          return <span key={i} className="text-primary">{part}</span>;
        }
        if (strings.test(part)) {
          strings.lastIndex = 0;
          return <span key={i} className="text-green-400">{part}</span>;
        }
        if (numbers.test(part)) {
          numbers.lastIndex = 0;
          return <span key={i} className="text-orange-400">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default CodeEditorMock;

import type { NodeState } from "../../engine/types";

/** Returns Tailwind-compatible color strings for each node state */
export function nodeColor(state: NodeState): {
  border: string;
  bg: string;
  text: string;
  glow: boolean;
} {
  switch (state) {
    case "active":
    case "comparing":
      return {
        border: "border-primary",
        bg: "bg-primary/15",
        text: "text-primary",
        glow: true,
      };
    case "visited":
      return {
        border: "border-emerald-400",
        bg: "bg-emerald-400/10",
        text: "text-emerald-300",
        glow: false,
      };
    case "found":
      return {
        border: "border-yellow-400",
        bg: "bg-yellow-400/15",
        text: "text-yellow-300",
        glow: true,
      };
    case "inserting":
      return {
        border: "border-sky-400",
        bg: "bg-sky-400/15",
        text: "text-sky-300",
        glow: false,
      };
    case "deleting":
      return {
        border: "border-rose-500",
        bg: "bg-rose-500/15",
        text: "text-rose-300",
        glow: false,
      };
    case "pivot":
      return {
        border: "border-violet-400",
        bg: "bg-violet-400/15",
        text: "text-violet-300",
        glow: true,
      };
    case "sorted":
      return {
        border: "border-emerald-500",
        bg: "bg-emerald-500/20",
        text: "text-emerald-200",
        glow: false,
      };
    case "idle":
    default:
      return {
        border: "border-border",
        bg: "bg-transparent",
        text: "text-foreground",
        glow: false,
      };
  }
}

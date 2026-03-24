import { create } from "zustand";
import type { DSFrame } from "../engine/types";

export type PlaybackStatus = "idle" | "playing" | "paused" | "done";

interface StepState {
  frames: DSFrame[];
  currentStep: number;
  status: PlaybackStatus;
  /** 0–100 speed percentage */
  speed: number;

  // ── Derived ───────────────────────────────────────────────────────────
  readonly isPlaying: boolean;

  // ── Actions ──────────────────────────────────────────────────────────
  setFrames: (frames: DSFrame[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  /** Advance one tick (called by the scheduler on each RAF tick). */
  tick: () => void;
  setSpeed: (pct: number) => void;
  goToStep: (index: number) => void;
}

export const useStepStore = create<StepState>()((set, get) => ({
  frames: [],
  currentStep: 0,
  status: "idle",
  speed: 50,

  get isPlaying() {
    return get().status === "playing";
  },

  setFrames: (frames) =>
    set({ frames, currentStep: 0, status: "idle" }),

  play: () => {
    const { frames, currentStep } = get();
    if (frames.length === 0) return;
    // If we're at the end, restart from beginning
    if (currentStep >= frames.length - 1) {
      set({ currentStep: 0, status: "playing" });
    } else {
      set({ status: "playing" });
    }
  },

  pause: () => set({ status: "paused" }),

  reset: () => set({ currentStep: 0, status: "idle" }),

  nextStep: () => {
    const { currentStep, frames } = get();
    if (currentStep < frames.length - 1) {
      set({ currentStep: currentStep + 1, status: "paused" });
    } else {
      set({ status: "done" });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1, status: "paused" });
    }
  },

  tick: () => {
    const { currentStep, frames, status } = get();
    if (status !== "playing") return;
    if (currentStep >= frames.length - 1) {
      set({ status: "done" });
    } else {
      set({ currentStep: currentStep + 1 });
    }
  },

  setSpeed: (pct) => set({ speed: Math.max(10, Math.min(100, pct)) }),

  goToStep: (index) => {
    const { frames } = get();
    const clamped = Math.max(0, Math.min(index, frames.length - 1));
    set({ currentStep: clamped, status: "paused" });
  },
}));

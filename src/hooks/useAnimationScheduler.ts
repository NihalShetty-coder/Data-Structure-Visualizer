import { useEffect, useRef } from "react";
import { useStepStore } from "../store/stepStore";

/**
 * Drives animation by calling tick() on each RAF frame, rate-limited by speed.
 *
 * Speed mapping (0-100 → ms per step):
 *   10%  → ~2000 ms/step  (very slow)
 *   50%  → ~500 ms/step   (default)
 *   100% → ~120 ms/step   (very fast)
 */
export function useAnimationScheduler() {
  const status = useStepStore((s) => s.status);
  const speed  = useStepStore((s) => s.speed);
  const tick   = useStepStore((s) => s.tick);

  const lastTickRef = useRef<number>(0);
  const rafRef      = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "playing") {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    // Logarithmic speed curve: speed=10→2000ms, speed=50→500ms, speed=100→120ms
    const interval = 2200 / Math.pow(speed / 10, 1.25);

    const loop = (ts: number) => {
      if (ts - lastTickRef.current >= interval) {
        lastTickRef.current = ts;
        tick();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [status, speed, tick]);
}

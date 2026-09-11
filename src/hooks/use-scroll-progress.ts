import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Returns progress (0 -> 1) of how far the element has scrolled through the viewport.
 * 0 = element top is at viewport top, 1 = element bottom is at viewport bottom.
 */
export function useScrollProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress];
}

/** Adds a class once the element enters the viewport. */
export function useReveal<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, shown];
}

/**
 * Progress of an element travelling through the viewport.
 * 0 = element top just entered from the bottom, 1 = element bottom left the top.
 */
export function useViewportProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0.5);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress];
}

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Maps a value from one range to another, clamped. */
export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp01((v - inMin) / (inMax - inMin || 1));
  return outMin + (outMax - outMin) * t;
}

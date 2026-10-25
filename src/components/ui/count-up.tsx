'use client';

import * as React from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Animatsiya davomiyligi (ms) */
  duration?: number;
}

/**
 * Raqamni 0 dan qiymatgacha sanab chiqadi — element ekranga kirganda boshlanadi.
 * Reduced-motion holatida darhol yakuniy qiymat ko'rsatiladi.
 */
export function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 1600,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // Boshlang'ich qiymat har doim 0: `useReducedMotion()` serverda hamisha
  // false qaytaradi, shuning uchun uni bu yerda ishlatish SSR va brauzer
  // natijasini ajratib yuborardi (hydration xatosi). Yakuniy qiymat
  // quyidagi effektda darhol qo'yiladi.
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

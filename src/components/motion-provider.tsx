'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Global Framer Motion sozlamasi.
 * `reducedMotion="user"` — tizim "prefers-reduced-motion" ni hurmat qiladi:
 * transform/opacity animatsiyalari avtomatik o'chiriladi, kontent darhol ko'rinadi.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

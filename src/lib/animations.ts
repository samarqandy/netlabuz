import type { Transition, Variants } from 'framer-motion';

/* =========================================================================
 * NETLAB — Markazlashgan Framer Motion animation tizimi
 * Barcha variant/transition tokenlari shu yerda. Komponentlarda import qiling.
 * Reduced-motion: global `<MotionConfig reducedMotion="user">` (motion-provider.tsx)
 * yoki komponentda `useReducedMotion()` orqali hurmat qilinadi.
 * ========================================================================= */

/* ------------------------------ Tokens ------------------------------ */

// Duration tokenlari (soniyada)
export const durations = {
  fast: 0.1,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
} as const;

// Bezier tuple — Framer `Easing` tipiga mos bo'lishi uchun aniq tip
type Bezier = [number, number, number, number];

// Easing egri chiziqlari
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1] as Bezier,
  easeOut: [0.0, 0, 0.2, 1] as Bezier,
  spring: { type: 'spring', stiffness: 300, damping: 20 } as Transition,
} as const;

/* ----------------------- Reveal / Fade variantlari ----------------------- */

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slower, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: durations.slow, ease: easing.easeInOut },
  },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slower, ease: easing.easeOut },
  },
  exit: { opacity: 0, y: 20, transition: { duration: durations.slow } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: durations.slow, ease: easing.easeOut },
  },
  exit: { opacity: 0, transition: { duration: durations.normal } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: easing.easeOut },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: durations.normal } },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -32 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.slower, ease: easing.easeOut },
  },
  exit: { opacity: 0, x: -32, transition: { duration: durations.slow } },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 32 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.slower, ease: easing.easeOut },
  },
  exit: { opacity: 0, x: 32, transition: { duration: durations.slow } },
};

/* --------------------------- Stagger (ota/bola) --------------------------- */

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Bola element — staggerContainer ichida ishlatiladi
export const staggerItem: Variants = fadeInUp;

/* ------------------------- Hover / Tap interaksiyalari ------------------------- */
/* Bular `Variants` emas — motion komponentiga props sifatida tarqatiladi:
   <motion.div {...scaleHover} /> */

export const scaleHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: easing.spring,
} as const;

export const glowEffect = {
  whileHover: {
    boxShadow: '0 0 30px rgba(0, 102, 204, 0.5)',
  },
  transition: { duration: durations.slow, ease: easing.easeInOut },
} as const;

// Cyber-green glow (accent variant)
export const glowAccent = {
  whileHover: {
    boxShadow: '0 0 30px rgba(0, 255, 136, 0.45)',
  },
  transition: { duration: durations.slow, ease: easing.easeInOut },
} as const;

// Karta uchun: ko'tarilish + glow birgalikda
export const cardHover = {
  whileHover: { y: -6, boxShadow: '0 0 28px rgba(0, 102, 204, 0.35)' },
  whileTap: { scale: 0.99 },
  transition: easing.spring,
} as const;

/* ------------------------------ Page transitions ------------------------------ */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easing.easeOut },
  },
  exit: { opacity: 0, y: -8, transition: { duration: durations.normal } },
};

/* ------------------------------ Yordamchilar ------------------------------ */

// Scroll-reveal uchun standart viewport sozlamasi:
// <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={defaultViewport} />
export const defaultViewport = { once: true, amount: 0.2 } as const;

/**
 * Stagger orasidagi kechikishni moslab beradi.
 * @example variants={staggerWithDelay(0.15)}
 */
export function staggerWithDelay(stagger = 0.1, delayChildren = 0): Variants {
  return {
    initial: {},
    animate: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

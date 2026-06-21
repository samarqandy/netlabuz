'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';

import {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  defaultViewport,
} from '@/lib/animations';

const VARIANTS: Record<string, Variants> = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
};

type RevealVariant = keyof typeof VARIANTS;

interface RevealProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  variant?: RevealVariant;
  /** Faqat bir marta animatsiya (default: true) */
  once?: boolean;
  /** Ko'rinish ulushi (0-1) */
  amount?: number;
  delay?: number;
}

/**
 * Element vьюportga kirganda animatsiya bilan paydo bo'ladi (scroll-reveal).
 * Reduced-motion global MotionConfig orqali avtomatik hurmat qilinadi.
 */
export function Reveal({
  variant = 'fadeInUp',
  once = true,
  amount = 0.2,
  delay,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      variants={VARIANTS[variant]}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Bolalarini ketma-ket (stagger) animatsiya qiluvchi konteyner.
 * Bolalarni <StaggerItem> bilan o'rang.
 */
export function StaggerGroup({
  once = true,
  amount = 0.2,
  children,
  ...props
}: Omit<RevealProps, 'variant' | 'delay'>) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}

// Re-export, foydalanuvchilar uchun qulay
export { defaultViewport };

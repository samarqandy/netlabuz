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

// Element ekranning pastki chetidan 40px yuqoriga chiqqanda ochiladi —
// chetida "yarim yashirin" holda qolib ketmaydi.
const REVEAL_MARGIN = '0px 0px -40px 0px';

interface RevealProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  variant?: RevealVariant;
  /** Faqat bir marta animatsiya (default: true) */
  once?: boolean;
  /**
   * Qancha qismi ko'ringanda ochilsin. Sukut bo'yicha — "some": element
   * ekranga kira boshlashi bilan. Ulush (0-1) bermang uzun bloklarga:
   * telefonda bir ustunli kartalar guruhi ekrandan 5 marta uzun bo'ladi,
   * 0.2 ulush hech qachon ko'rinmaydi va blok bo'sh qoladi.
   */
  amount?: number | 'some' | 'all';
  delay?: number;
}

/**
 * Element vьюportga kirganda animatsiya bilan paydo bo'ladi (scroll-reveal).
 * Reduced-motion global MotionConfig orqali avtomatik hurmat qilinadi.
 */
export function Reveal({
  variant = 'fadeInUp',
  once = true,
  amount = 'some',
  delay,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      variants={VARIANTS[variant]}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount, margin: REVEAL_MARGIN }}
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
  amount = 'some',
  children,
  ...props
}: Omit<RevealProps, 'variant' | 'delay'>) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount, margin: REVEAL_MARGIN }}
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

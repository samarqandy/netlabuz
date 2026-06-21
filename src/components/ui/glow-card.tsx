'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { easing } from '@/lib/animations';

type GlowColor = 'blue' | 'green' | 'cyan';

const GLOW_SHADOW: Record<GlowColor, string> = {
  blue: '0 0 28px rgba(0, 102, 204, 0.35)',
  green: '0 0 28px rgba(0, 255, 136, 0.30)',
  cyan: '0 0 28px rgba(0, 212, 255, 0.32)',
};

export interface GlowCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  glow?: GlowColor;
  /** Hover'da ko'tarilish (px) */
  lift?: number;
}

/**
 * Interaktiv "cyber" karta — hover'da ko'tariladi va tanlangan rangda porlaydi.
 * Reduced-motion'da harakat o'chiriladi (faqat statik chegara qoladi).
 */
export const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, glow = 'blue', lift = 6, children, ...props }, ref) => {
    const reduce = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        whileHover={
          reduce ? undefined : { y: -lift, boxShadow: GLOW_SHADOW[glow] }
        }
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={easing.spring}
        className={cn(
          'group relative rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm',
          'transition-colors duration-300 hover:border-primary/50',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlowCard.displayName = 'GlowCard';

'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Terminal } from '@/components/ui/terminal';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { track } from '@/lib/track';

const STATS = [
  { value: 50, suffix: '+', key: 'graduates' },
  { value: 100, suffix: '%', key: 'practice' },
  { value: 6, suffix: '', key: 'directions' },
] as const;

export function Hero() {
  const t = useTranslations('Hero');
  // CountUp (JS logikasi) uchun kerak; variantlar global MotionConfig orqali.
  const reduce = useReducedMotion();
  const roles = t.raw('roles') as string[];

  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] items-center overflow-hidden pt-24 sm:pt-16"
    >
      {/* Animated tech grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] motion-safe:animate-grid-move"
      />
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 -z-10 size-[28rem] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 size-[24rem] rounded-full bg-accent/[0.07] blur-[120px]"
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container grid items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
      >
        {/* Chap: matn + CTA + statistika */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <motion.div
            variants={staggerItem}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {t('badge')}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={staggerItem}
            className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('titleLine1')}{' '}
            <span className="text-gradient-tech">{t('titleAccent')}</span>{' '}
            {t('titleLine2')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={staggerItem}
            className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" variant="accent">
              <a
                href="#contact"
                onClick={() => track('cta_click', { location: 'hero' })}
              >
                <MessageCircle className="size-4" /> {t('ctaPrimary')}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#courses">
                {t('ctaSecondary')} <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.dl
            variants={staggerItem}
            className="mt-12 grid w-full max-w-md grid-cols-3 gap-4 sm:gap-8"
          >
            {STATS.map((stat) => (
              <div
                key={stat.key}
                className="flex flex-col items-center lg:items-start"
              >
                <dt className="sr-only">{t(`stats.${stat.key}`)}</dt>
                <dd className="font-mono text-3xl font-bold text-foreground sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} reduce={!!reduce} />
                </dd>
                <span className="mt-1 text-sm text-muted-foreground">
                  {t(`stats.${stat.key}`)}
                </span>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* O'ng: terminal (lg dan boshlab yonda, mobilda pastda) */}
        <motion.div variants={staggerItem} className="w-full max-w-xl lg:max-w-none">
          <Terminal title={t('terminalTitle')} roles={roles} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Raqamni 0 dan qiymatgacha animatsiya qiladi (reduce holatda darhol) */
function CountUp({
  value,
  suffix,
  reduce,
}: {
  value: number;
  suffix: string;
  reduce: boolean;
}) {
  const [display, setDisplay] = React.useState(reduce ? value : 0);

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

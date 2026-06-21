'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Phone, Cpu, Network, Terminal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem } from '@/lib/animations';

const PHONE = '+998936803113';

const STATS = [
  { value: 50, suffix: '+', key: 'graduates' },
  { value: 100, suffix: '%', key: 'practice' },
  { value: 6, suffix: '+', key: 'directions' },
] as const;

export function Hero() {
  const t = useTranslations('Hero');
  // CountUp/FloatingIcons (transform bo'lmagan/JS logikasi) uchun kerak.
  // Variant darajasidagi reduced-motion global MotionConfig orqali boshqariladi.
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] items-center overflow-hidden pt-16"
    >
      {/* Animated tech grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] motion-safe:animate-grid-move"
      />
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 -z-10 size-[28rem] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 size-[24rem] rounded-full bg-accent/20 blur-[120px]"
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container flex flex-col items-center text-center"
      >
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
          className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t('titleLine1')}{' '}
          <span className="text-gradient-tech">{t('titleAccent')}</span>{' '}
          {t('titleLine2')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={staggerItem}
          className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={staggerItem}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" variant="accent">
            <a href="#courses">
              {t('ctaPrimary')} <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`tel:${PHONE}`}>
              <Phone className="size-4" /> {t('ctaSecondary')}
            </a>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.dl
          variants={staggerItem}
          className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4 sm:gap-8"
        >
          {STATS.map((stat) => (
            <div key={stat.key} className="flex flex-col items-center">
              <dt className="sr-only">{t(`stats.${stat.key}`)}</dt>
              <dd className="text-3xl font-extrabold text-foreground sm:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix} reduce={!!reduce} />
              </dd>
              <span className="mt-1 text-sm text-muted-foreground">
                {t(`stats.${stat.key}`)}
              </span>
            </div>
          ))}
        </motion.dl>

        {/* Floating tech icons (decorative) */}
        <FloatingIcons reduce={!!reduce} />
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

/** Dekorativ suzuvchi texno-ikonkalar */
function FloatingIcons({ reduce }: { reduce: boolean }) {
  const icons = [
    { Icon: Cpu, className: 'left-[6%] top-[22%]' },
    { Icon: Network, className: 'right-[8%] top-[30%]' },
    { Icon: Terminal, className: 'left-[12%] bottom-[14%]' },
  ];
  return (
    <>
      {icons.map(({ Icon, className }, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute hidden text-primary/30 lg:block ${className}`}
          animate={reduce ? undefined : { y: [0, -14, 0] }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon className="size-10" />
        </motion.div>
      ))}
    </>
  );
}

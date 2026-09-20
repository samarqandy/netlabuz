'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

const TELEGRAM = 'https://t.me/netlabuz';

export function CtaBanner() {
  const t = useTranslations('CtaBanner');

  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <Reveal variant="scaleIn">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/10 px-6 py-14 text-center sm:px-12 sm:py-16">
            {/* Dekorativ glow va grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/25 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/20 blur-[100px]"
            />

            <h2 className="relative text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {t('title')}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-pretty text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <a href="#contact">
                  {t('primary')} <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                  <Send className="size-4" /> {t('secondary')}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

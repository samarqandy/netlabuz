'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

/* =========================================================================
 * DIQQAT: messages/{uz,ru,en}.json dagi Testimonials.items — NAMUNA matnlar.
 * Saytni e'lon qilishdan oldin haqiqiy bitiruvchilar fikrlari (ism, kurs,
 * rozilik bilan) bilan almashtirilishi SHART.
 * ========================================================================= */

const ITEMS = ['t1', 't2', 't3'] as const;

/** Ism bosh harfidan avatar doirasi */
function Avatar({ name }: { name: string }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-secondary/50 font-mono text-base font-bold text-accent">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function Testimonials() {
  const t = useTranslations('Testimonials');

  return (
    <section id="reviews" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ITEMS.map((id) => {
            const name = t(`items.${id}.name`);
            return (
              <StaggerItem key={id} className="h-full">
                <GlowCard glow="cyan" className="flex h-full flex-col">
                  <Quote
                    aria-hidden
                    className="size-7 text-accent/60"
                    strokeWidth={1.5}
                  />
                  <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    “{t(`items.${id}.text`)}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                    <Avatar name={name} />
                    <span>
                      <span className="block font-semibold">{name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {t(`items.${id}.course`)}
                      </span>
                    </span>
                  </figcaption>
                </GlowCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

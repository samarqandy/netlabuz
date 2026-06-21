'use client';

import { useTranslations } from 'next-intl';
import { ClipboardList, MessageSquare, MonitorPlay, Award } from 'lucide-react';

import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

const STEPS = [
  { key: 'apply', Icon: ClipboardList },
  { key: 'consult', Icon: MessageSquare },
  { key: 'learn', Icon: MonitorPlay },
  { key: 'certificate', Icon: Award },
] as const;

export function Process() {
  const t = useTranslations('Process');

  return (
    <section
      id="how"
      className="scroll-mt-20 border-y border-border/60 bg-secondary/20 py-20 sm:py-28"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <StaggerGroup className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Bog'lovchi chiziq (faqat lg) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />

          {STEPS.map(({ key, Icon }, i) => (
            <StaggerItem key={key} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 grid size-14 place-items-center rounded-full border border-border bg-background text-accent shadow-sm">
                <Icon className="size-6" strokeWidth={1.75} />
                <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {t(`steps.${key}.description`)}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { GraduationCap, CalendarClock, FlaskConical, LayoutGrid } from 'lucide-react';

import { CountUp } from '@/components/ui/count-up';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

// Qiymatlar — tasdiqlanishi kerak (placeholder marketing raqamlari)
const STATS = [
  { key: 'graduates', value: 50, suffix: '+', Icon: GraduationCap },
  { key: 'experience', value: 5, suffix: '+', Icon: CalendarClock },
  { key: 'practice', value: 100, suffix: '%', Icon: FlaskConical },
  { key: 'directions', value: 6, suffix: '', Icon: LayoutGrid },
] as const;

export function Stats() {
  const t = useTranslations('Stats');

  return (
    <section id="why" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <StaggerGroup className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-card/50">
          {/* Dekorativ glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-accent/10 blur-3xl"
          />

          <dl className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
            {STATS.map(({ key, value, suffix, Icon }) => (
              <StaggerItem
                key={key}
                className="flex flex-col items-center gap-2 bg-card px-6 py-10 text-center"
              >
                <Icon className="size-7 text-accent" strokeWidth={1.75} />
                <dd className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  <CountUp value={value} suffix={suffix} />
                </dd>
                <dt className="text-sm text-muted-foreground">{t(key)}</dt>
              </StaggerItem>
            ))}
          </dl>
        </StaggerGroup>
      </div>
    </section>
  );
}

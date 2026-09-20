'use client';

import { useTranslations } from 'next-intl';
import {
  Server,
  FlaskConical,
  Users,
  Award,
  Briefcase,
  MessagesSquare,
} from 'lucide-react';

import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

const FEATURES = [
  { key: 'lab', Icon: Server, glow: 'blue' },
  { key: 'practice', Icon: FlaskConical, glow: 'green' },
  { key: 'mentors', Icon: Users, glow: 'cyan' },
  { key: 'certificate', Icon: Award, glow: 'green' },
  { key: 'career', Icon: Briefcase, glow: 'blue' },
  { key: 'consult', Icon: MessagesSquare, glow: 'cyan' },
] as const;

const ICON_COLOR: Record<string, string> = {
  blue: 'text-primary',
  green: 'text-accent',
  cyan: 'text-tech-cyan',
};

export function WhyUs() {
  const t = useTranslations('WhyUs');

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

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, Icon, glow }) => (
            <StaggerItem key={key} className="h-full">
              <GlowCard glow={glow} className="h-full">
                <div
                  className={`grid size-12 place-items-center rounded-xl border border-border bg-secondary/40 ${ICON_COLOR[glow]}`}
                >
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`features.${key}.description`)}
                </p>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

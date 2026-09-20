'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import { MENTORS } from '@/lib/mentors';
import type { Locale } from '@/i18n/routing';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

export function Mentors() {
  const t = useTranslations('Mentors');
  const locale = useLocale() as Locale;

  // Haqiqiy ustozlar ma'lumoti kiritilmaguncha seksiya ko'rinmaydi
  if (MENTORS.length === 0) return null;

  return (
    <section id="mentors" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MENTORS.map((mentor) => (
            <StaggerItem key={mentor.name} className="h-full">
              <GlowCard glow="blue" className="flex h-full flex-col items-center text-center">
                {mentor.photo ? (
                  <Image
                    src={mentor.photo}
                    alt={mentor.name}
                    width={96}
                    height={96}
                    className="size-24 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="grid size-24 place-items-center rounded-full border border-border bg-secondary/50 font-mono text-3xl font-bold text-primary">
                    {mentor.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <h3 className="mt-4 text-lg font-bold tracking-tight">
                  {mentor.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mentor.role[locale]}
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {mentor.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

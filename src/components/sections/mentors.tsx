'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Award, ExternalLink } from 'lucide-react';

import { MENTORS, type Mentor } from '@/lib/mentors';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

/** Surat bo'lmasa — ism bosh harfidan avatar */
function Avatar({ mentor, size }: { mentor: Mentor; size: number }) {
  const cls = 'shrink-0 rounded-full border border-border object-cover';
  if (mentor.photo) {
    return (
      <Image
        src={mentor.photo}
        alt={mentor.name}
        width={size}
        height={size}
        className={cls}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        cls,
        'grid place-items-center bg-secondary/50 font-mono font-bold text-primary'
      )}
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {mentor.name.charAt(0).toUpperCase()}
    </span>
  );
}

function Chips({ items, mono }: { items: string[]; mono?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-xs text-muted-foreground',
            mono && 'font-mono'
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function SiteLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
    >
      {href.replace(/^https?:\/\//, '')}
      <ExternalLink
        aria-hidden
        className="size-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
      <span className="sr-only">{label}</span>
    </a>
  );
}

export function Mentors() {
  const t = useTranslations('Mentors');
  const locale = useLocale() as Locale;

  // Haqiqiy ustozlar ma'lumoti kiritilmaguncha seksiya ko'rinmaydi
  if (MENTORS.length === 0) return null;

  const leads = MENTORS.filter((m) => m.lead);
  const others = MENTORS.filter((m) => !m.lead);

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

        {/* Bosh ustoz — keng karta */}
        {leads.map((mentor) => (
          <Reveal key={mentor.name} variant="fadeIn" className="mt-12">
            <GlowCard glow="blue" className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
                <Avatar mentor={mentor} size={112} />

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold tracking-tight">
                    {mentor.name}
                  </h3>
                  <p className="mt-1 text-sm text-primary">
                    {mentor.role[locale]}
                  </p>
                  {mentor.experienceYears !== undefined && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      {t('experience', { years: mentor.experienceYears })}
                    </p>
                  )}
                  {mentor.bio && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {mentor.bio[locale]}
                    </p>
                  )}

                  {mentor.credentials && mentor.credentials.length > 0 && (
                    <div className="mt-5">
                      <h4 className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:justify-start">
                        <Award aria-hidden className="size-3.5 text-accent" />
                        {t('credentialsTitle')}
                      </h4>
                      <div className="mt-2 flex justify-center sm:justify-start">
                        <Chips items={mentor.credentials} />
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col items-center gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <Chips items={mentor.topics} mono />
                    {mentor.site && (
                      <SiteLink href={mentor.site} label={t('siteLabel')} />
                    )}
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        ))}

        {/* Qolgan ustozlar */}
        {others.length > 0 && (
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((mentor) => (
              <StaggerItem key={mentor.name} className="h-full">
                <GlowCard
                  glow="blue"
                  className="flex h-full flex-col items-center text-center"
                >
                  <Avatar mentor={mentor} size={96} />
                  <h3 className="mt-4 text-lg font-bold tracking-tight">
                    {mentor.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mentor.role[locale]}
                  </p>
                  {mentor.credentials && mentor.credentials.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <Chips items={mentor.credentials} />
                    </div>
                  )}
                  <div className="mt-4 flex flex-1 items-end justify-center">
                    <Chips items={mentor.topics} mono />
                  </div>
                  {mentor.site && (
                    <div className="mt-4">
                      <SiteLink href={mentor.site} label={t('siteLabel')} />
                    </div>
                  )}
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}

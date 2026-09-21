'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Clock, FlaskConical, UserCheck } from 'lucide-react';

import { LAB_CATEGORIES, LAB_OPEN_HOURS, LAB_PHOTOS } from '@/lib/lab';
import { GLOW_TEXT } from '@/lib/courses';
import { cn } from '@/lib/utils';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

/**
 * Laboratoriya — markazning asosiy farqlovchi tomoni: onlayn maktablar
 * takrorlay olmaydigan haqiqiy uskunalar. Ochiq soatlar va suratlar
 * ixtiyoriy (src/lib/lab.ts): kiritilmasa, o'sha qism ko'rsatilmaydi.
 */
export function Lab() {
  const t = useTranslations('Lab');

  const highlights = [
    { Icon: FlaskConical, label: t('practiceLabel'), value: t('practiceValue') },
    {
      Icon: UserCheck,
      label: t('workstationLabel'),
      value: t('workstationValue'),
    },
    ...(LAB_OPEN_HOURS
      ? [{ Icon: Clock, label: t('openHoursLabel'), value: LAB_OPEN_HOURS }]
      : []),
  ];

  return (
    <section
      id="lab"
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

        {/* Asosiy da'volar */}
        <Reveal variant="fadeIn" className="mt-10">
          <dl
            className={cn(
              'mx-auto grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border',
              // Ustunlar soni belgilar soniga moslashadi — ochiq soatlar
              // kiritilmagan bo'lsa bo'sh katak qolmaydi
              highlights.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            )}
          >
            {highlights.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 bg-card px-5 py-6 text-center"
              >
                <Icon className="size-5 text-accent" strokeWidth={1.75} />
                <dd className="mt-1 font-mono text-xl font-bold">{value}</dd>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Uskuna guruhlari */}
        <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LAB_CATEGORIES.map(({ key, icon: Icon, items, glow }) => (
            <StaggerItem key={key} className="h-full">
              <GlowCard glow={glow} className="flex h-full flex-col">
                <div
                  className={cn(
                    'grid size-12 place-items-center rounded-xl border border-border bg-secondary/40',
                    GLOW_TEXT[glow]
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight">
                  {t(`categories.${key}.title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {t(`categories.${key}.description`)}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Suratlar — lab.ts da LAB_PHOTOS to'ldirilgandagina */}
        {LAB_PHOTOS.length > 0 && (
          <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {LAB_PHOTOS.map((photo) => (
              <StaggerItem
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
              >
                <Image
                  src={photo.src}
                  alt={t(`photos.${photo.altKey}`)}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Target } from 'lucide-react';

import { TRACKS } from '@/lib/tracks';
import { COURSES, GLOW_TEXT } from '@/lib/courses';
import { COURSE_DETAILS } from '@/lib/course-details';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { track as trackEvent } from '@/lib/track';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

/**
 * Karyera yo'llari — kurslarni o'rganish tartibi bo'yicha guruhlaydi.
 * Yangi kurs emas: mavjud kurslarga tavsiya etilgan ketma-ketlik beradi
 * ("professiya" naqshi — QA, Specialist va boshqa yirik markazlarda).
 */
export function Tracks() {
  const t = useTranslations('Tracks');
  const tc = useTranslations('Courses');

  return (
    <section id="path" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 lg:grid-cols-3">
          {TRACKS.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.id} className="h-full">
                <GlowCard glow={item.glow} className="flex h-full flex-col">
                  <div
                    className={cn(
                      'grid size-12 place-items-center rounded-xl border border-border bg-secondary/40',
                      GLOW_TEXT[item.glow]
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">
                    {t(`items.${item.id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`items.${item.id}.description`)}
                  </p>

                  {/* Bosqichlar */}
                  <ol className="relative mt-6 flex-1 space-y-3">
                    {item.courses.map((courseId, i) => {
                      const course = COURSES.find((c) => c.id === courseId);
                      if (!course) return null;
                      const isLast = i === item.courses.length - 1;
                      return (
                        <li key={courseId} className="relative flex gap-3">
                          {/* Bog'lovchi chiziq */}
                          {!isLast && (
                            <span
                              aria-hidden
                              className="absolute left-[0.6875rem] top-6 h-[calc(100%-0.5rem)] w-px bg-border"
                            />
                          )}
                          <span
                            aria-hidden
                            className="relative z-10 mt-0.5 grid size-[1.375rem] shrink-0 place-items-center rounded-full border border-border bg-card font-mono text-[0.65rem] font-bold text-muted-foreground"
                          >
                            {i + 1}
                          </span>
                          <Link
                            href={{
                              pathname: '/courses/[slug]',
                              params: { slug: COURSE_DETAILS[courseId].slug },
                            }}
                            onClick={() =>
                              trackEvent('course_open', {
                                course: courseId,
                                source: `track_${item.id}`,
                              })
                            }
                            className="group/step -mt-0.5 inline-flex items-start gap-1.5 text-sm font-medium transition-colors hover:text-accent"
                          >
                            {tc(`items.${courseId}.name`)}
                            <ArrowRight className="mt-1 size-3.5 shrink-0 opacity-0 transition-all group-hover/step:translate-x-0.5 group-hover/step:opacity-100" />
                          </Link>
                        </li>
                      );
                    })}
                  </ol>

                  {/* Natija */}
                  <div className="mt-6 flex items-start gap-2.5 border-t border-border/60 pt-5">
                    <Target
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-accent"
                    />
                    <span className="text-sm">
                      <span className="text-muted-foreground">
                        {t('resultLabel')}:{' '}
                      </span>
                      <span className="font-medium">
                        {t(`items.${item.id}.result`)}
                      </span>
                    </span>
                  </div>
                </GlowCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

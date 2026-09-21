'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Award, Clock } from 'lucide-react';

import {
  COURSES,
  COURSE_LEVELS,
  GLOW_TEXT,
  type CourseLevel,
} from '@/lib/courses';
import { COURSE_DETAILS } from '@/lib/course-details';
import { formatPrice } from '@/lib/price';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { track } from '@/lib/track';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

type Filter = 'all' | CourseLevel;

export function Courses() {
  const t = useTranslations('Courses');
  const [filter, setFilter] = React.useState<Filter>('all');

  const filters: Filter[] = ['all', ...COURSE_LEVELS];
  const visible =
    filter === 'all' ? COURSES : COURSES.filter((c) => c.level === filter);

  return (
    <section id="courses" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        {/* Filtr tugmalari */}
        <Reveal
          variant="fadeIn"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {filters.map((f) => {
            const active = filter === f;
            const label = f === 'all' ? t('filterAll') : t(f);
            return (
              <Button
                key={f}
                size="sm"
                variant={active ? 'default' : 'outline'}
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full',
                  active && 'shadow-glow-blue'
                )}
              >
                {label}
              </Button>
            );
          })}
        </Reveal>

        {/* Kartalar — filter o'zgarganda qayta stagger bo'ladi (key) */}
        <StaggerGroup
          key={filter}
          once={false}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((course) => {
            const Icon = course.icon;
            const detail = COURSE_DETAILS[course.id];
            const soon = course.status === 'soon';
            return (
              <StaggerItem key={course.id} className="h-full">
                <GlowCard
                  glow={course.glow}
                  lift={soon ? 0 : 6}
                  className="flex h-full flex-col"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        'grid size-14 place-items-center rounded-xl border border-border bg-secondary/40',
                        soon ? 'text-muted-foreground' : GLOW_TEXT[course.glow]
                      )}
                    >
                      <Icon className="size-7" strokeWidth={1.75} />
                    </div>
                    <Badge variant={soon ? 'outline' : course.level}>
                      {soon ? t('soon') : t(course.level)}
                    </Badge>
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight">
                    {t(`items.${course.id}.name`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {t(`items.${course.id}.description`)}
                  </p>

                  {/* Asosiy mavzular */}
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {course.topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
                    <span className="flex min-w-0 flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-4" />
                          {t('duration', { months: course.months })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Award className="size-4" />
                          {t('certificate')}
                        </span>
                      </span>
                      {/* Narx faqat tasdiqlangan bo'lsa ko'rinadi */}
                      {course.priceFrom !== undefined && (
                        <span className="font-semibold text-foreground">
                          {t('priceFrom', { price: formatPrice(course.priceFrom) })}
                        </span>
                      )}
                    </span>

                    {detail ? (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="group/btn -mr-2 shrink-0 text-primary hover:text-primary"
                      >
                        <Link
                          href={{
                            pathname: '/courses/[slug]',
                            params: { slug: detail.slug },
                          }}
                          onClick={() =>
                            track('course_open', {
                              course: course.id,
                              source: 'card',
                            })
                          }
                        >
                          {t('detailsCta')}
                          <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    ) : (
                      /* Tayyorlanayotgan kurs — qiziqish bildirish uchun
                         forma kursni oldindan tanlab ochiladi */
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="group/btn -mr-2 shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        <a
                          href="#contact"
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent('netlab:select-course', {
                                detail: course.id,
                              })
                            );
                            track('course_select', {
                              course: course.id,
                              source: 'card_soon',
                            });
                          }}
                        >
                          {t('soonCta')}
                          <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </a>
                      </Button>
                    )}
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

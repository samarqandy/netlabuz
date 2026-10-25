'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Check, Target } from 'lucide-react';

import { LAB_PROJECTS } from '@/lib/projects';
import { COURSES, GLOW_TEXT } from '@/lib/courses';
import { COURSE_DETAILS } from '@/lib/course-details';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { track as trackEvent } from '@/lib/track';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

/**
 * Amaliy loyihalar — laboratoriya bo'limidan keyin keladi va uni mantiqan
 * yakunlaydi: avval "bizda shu uskunalar bor", keyin "ularda mana shuni
 * qurasiz".
 *
 * Tugmalar mavjud bo'lmagan sahifaga olib bormaydi: har karta o'zi tayangan
 * KURS sahifalariga bog'lanadi. Laboratoriya materiallari paydo bo'lgandan
 * keyingina ularga alohida havola qo'shiladi.
 */
export function Projects() {
  const t = useTranslations('Projects');
  const tc = useTranslations('Courses');

  return (
    <section id="projects" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {LAB_PROJECTS.map((project) => {
            const Icon = project.icon;
            const tasks = t.raw(`items.${project.id}.tasks`) as string[];

            return (
              <StaggerItem key={project.id} className="h-full">
                <GlowCard glow={project.glow} className="flex h-full flex-col">
                  <div
                    className={cn(
                      'grid size-12 place-items-center rounded-xl border border-border bg-secondary/40',
                      GLOW_TEXT[project.glow]
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold tracking-tight">
                    {t(`items.${project.id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`items.${project.id}.description`)}
                  </p>

                  {/* Uskuna teglari */}
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.tech.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Topshiriqlar */}
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('tasksLabel')}
                  </p>
                  <ul className="mt-3 flex-1 space-y-2">
                    {tasks.map((task) => (
                      <li key={task} className="flex gap-2.5 text-sm">
                        <Check
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-accent"
                          strokeWidth={2.5}
                        />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tayanch kurslar */}
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('coursesLabel')}
                  </p>
                  <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                    {project.courses.map((courseId) => {
                      const course = COURSES.find((c) => c.id === courseId);
                      const detail = COURSE_DETAILS[courseId];
                      if (!course || !detail) return null;
                      return (
                        <li key={courseId}>
                          <Link
                            href={{
                              pathname: '/courses/[slug]',
                              params: { slug: detail.slug },
                            }}
                            onClick={() =>
                              trackEvent('course_open', {
                                course: courseId,
                                source: `project_${project.id}`,
                              })
                            }
                            className="group/step inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent"
                          >
                            {tc(`items.${courseId}.name`)}
                            <ArrowRight className="size-3.5 shrink-0 opacity-0 transition-all group-hover/step:translate-x-0.5 group-hover/step:opacity-100" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

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
                        {t(`items.${project.id}.result`)}
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

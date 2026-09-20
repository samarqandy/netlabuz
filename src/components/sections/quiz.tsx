'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

import { COURSES } from '@/lib/courses';
import { cn } from '@/lib/utils';
import { track } from '@/lib/track';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

/* =========================================================================
 * Quiz — "Qaysi yo'nalish menga mos?" testi (ProWeb it-test patterni).
 * Har javob kurslarga ball qo'shadi; natija — eng ko'p ball to'plagan kurs.
 * Matnlar messages/*.json (Quiz), og'irliklar shu yerda.
 * ========================================================================= */

type CourseId = 'computer' | 'cisco' | 'iptelephony' | 'security' | 'linux' | 'iot';
type Weights = Partial<Record<CourseId, number>>;

const QUESTIONS: { id: string; options: { id: string; weights: Weights }[] }[] = [
  {
    id: 'q1',
    options: [
      { id: 'o1', weights: { computer: 3 } },
      { id: 'o2', weights: { iot: 2, cisco: 1, iptelephony: 1 } },
      { id: 'o3', weights: { linux: 2, cisco: 2, security: 1 } },
    ],
  },
  {
    id: 'q2',
    options: [
      { id: 'o1', weights: { cisco: 3, iptelephony: 1 } },
      { id: 'o2', weights: { linux: 3 } },
      { id: 'o3', weights: { security: 3 } },
      { id: 'o4', weights: { iot: 3 } },
      { id: 'o5', weights: { computer: 3 } },
    ],
  },
  {
    id: 'q3',
    options: [
      { id: 'o1', weights: { cisco: 2, computer: 1, iptelephony: 1 } },
      { id: 'o2', weights: { linux: 3, cisco: 1 } },
      { id: 'o3', weights: { security: 2, iptelephony: 2, iot: 1 } },
      { id: 'o4', weights: { iot: 2, computer: 2 } },
    ],
  },
  {
    id: 'q4',
    options: [
      { id: 'o1', weights: { security: 2, iot: 2 } },
      { id: 'o2', weights: { linux: 2, cisco: 2 } },
      { id: 'o3', weights: { computer: 2, iptelephony: 2 } },
    ],
  },
  {
    id: 'q5',
    options: [
      { id: 'o1', weights: { cisco: 2, iptelephony: 2 } },
      { id: 'o2', weights: { linux: 3 } },
      { id: 'o3', weights: { security: 3 } },
      { id: 'o4', weights: { iot: 3, computer: 1 } },
    ],
  },
];

function computeResult(answers: number[]): CourseId {
  const scores: Record<CourseId, number> = {
    computer: 0,
    cisco: 0,
    iptelephony: 0,
    security: 0,
    linux: 0,
    iot: 0,
  };
  answers.forEach((optIdx, qIdx) => {
    const weights = QUESTIONS[qIdx]?.options[optIdx]?.weights ?? {};
    for (const [id, pts] of Object.entries(weights)) {
      scores[id as CourseId] += pts ?? 0;
    }
  });
  let best: CourseId = 'computer';
  let bestScore = -1;
  // COURSES tartibi — teng ballda birinchisi ustun
  for (const course of COURSES) {
    const id = course.id as CourseId;
    if (scores[id] > bestScore) {
      best = id;
      bestScore = scores[id];
    }
  }
  return best;
}

export function Quiz() {
  const t = useTranslations('Quiz');
  const tc = useTranslations('Courses');

  const [answers, setAnswers] = React.useState<number[]>([]);
  const step = answers.length;
  const finished = step >= QUESTIONS.length;
  const resultId = finished ? computeResult(answers) : null;
  const resultCourse = resultId
    ? COURSES.find((c) => c.id === resultId)
    : null;

  const restart = () => setAnswers([]);
  const back = () => setAnswers((a) => a.slice(0, -1));
  const answer = (optIdx: number) =>
    setAnswers((a) => {
      const next = [...a, optIdx];
      if (next.length === QUESTIONS.length) {
        track('quiz_completed', { result: computeResult(next) });
      }
      return next;
    });

  return (
    <section
      id="quiz"
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

        <Reveal variant="fadeIn" className="mx-auto mt-12 max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {/* Progress */}
            {!finished && (
              <div className="mb-6">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>
                    {t('progress', {
                      current: step + 1,
                      total: QUESTIONS.length,
                    })}
                  </span>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="size-3.5" /> {t('back')}
                    </button>
                  )}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{
                      width: `${(step / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!finished ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                    {t(`questions.${QUESTIONS[step].id}.q`)}
                  </h3>
                  <div className="mt-5 grid gap-2.5">
                    {QUESTIONS[step].options.map((opt, i) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => answer(i)}
                        className={cn(
                          'group flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3.5 text-left text-sm font-medium transition-all',
                          'hover:border-primary/50 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        )}
                      >
                        {t(`questions.${QUESTIONS[step].id}.options.${opt.id}`)}
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                resultCourse && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center py-2 text-center"
                  >
                    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                      <Sparkles className="size-4" /> {t('resultEyebrow')}
                    </span>
                    <div className="mt-5 grid size-16 place-items-center rounded-2xl border border-border bg-secondary/40 text-primary">
                      <resultCourse.icon className="size-8" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 text-2xl font-extrabold tracking-tight">
                      {tc(`items.${resultCourse.id}.name`)}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                      {tc(`items.${resultCourse.id}.description`)}
                    </p>
                    <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {resultCourse.topics.map((topic) => (
                        <li
                          key={topic}
                          className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
                      <Button asChild variant="accent" size="lg">
                        <a
                          href="#contact"
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent('netlab:select-course', {
                                detail: resultCourse.id,
                              })
                            );
                            track('course_select', {
                              course: resultCourse.id,
                              source: 'quiz',
                            });
                          }}
                        >
                          {t('resultCta')} <ArrowRight className="size-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="lg" onClick={restart}>
                        <RotateCcw className="size-4" /> {t('restart')}
                      </Button>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

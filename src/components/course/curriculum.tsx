'use client';

import { useTranslations } from 'next-intl';

import type { CourseId } from '@/lib/courses';
import { COURSE_DETAILS } from '@/lib/course-details';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Kurs dasturi — modullar akkordioni.
 * Birinchi modul ochiq holatda (foydalanuvchi mazmunni darhol ko'radi).
 */
export function Curriculum({ courseId }: { courseId: CourseId }) {
  const t = useTranslations('CourseDetail');
  const detail = COURSE_DETAILS[courseId];
  // Dasturi yo'q kurs (tayyorlanmoqda) — sahifasi ham bo'lmaydi
  if (!detail) return null;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={detail.modules[0]?.key}
      className="space-y-3"
    >
      {detail.modules.map((module, i) => (
        <AccordionItem key={module.key} value={module.key}>
          <AccordionTrigger>
            <span className="flex items-baseline gap-3 text-left">
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              {t(`${courseId}.modules.${module.key}`)}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-wrap gap-1.5">
              {module.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

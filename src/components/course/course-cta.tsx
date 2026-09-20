'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Send } from 'lucide-react';

import type { CourseId } from '@/lib/courses';
import { ORG } from '@/lib/org';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Kurs sahifasidagi CTA juftligi.
 * Asosiy tugma bosh sahifadagi formaga o'tadi va `?course=` orqali
 * kursni oldindan tanlatadi (contact.tsx query'ni o'qiydi).
 */
export function CourseCta({
  courseId,
  locale,
  location,
  size = 'lg',
  stacked = false,
}: {
  courseId: CourseId;
  locale: string;
  location: string;
  size?: 'default' | 'lg';
  /** Tugmalar doim ustma-ust va to'liq kenglikda (yon panel uchun) */
  stacked?: boolean;
}) {
  const t = useTranslations('CourseDetail');

  return (
    <div
      className={cn(
        'flex gap-3',
        stacked ? 'flex-col [&>*]:w-full' : 'flex-col sm:flex-row'
      )}
    >
      <Button asChild size={size} variant="accent">
        <a
          href={`/${locale}?course=${courseId}#contact`}
          onClick={() => track('cta_click', { location, course: courseId })}
        >
          {t('ctaPrimary')} <ArrowRight className="size-4" />
        </a>
      </Button>
      <Button asChild size={size} variant="outline">
        <a
          href={ORG.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('telegram_click', { location, course: courseId })
          }
        >
          <Send className="size-4" /> {t('ctaSecondary')}
        </a>
      </Button>
    </div>
  );
}

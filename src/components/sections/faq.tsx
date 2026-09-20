'use client';

import { useTranslations } from 'next-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';
import { FAQ_KEYS } from '@/lib/faq';

export function Faq() {
  const t = useTranslations('Faq');

  return (
    <section
      id="faq"
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

        <Reveal variant="fadeIn" className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_KEYS.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>{t(`items.${key}.q`)}</AccordionTrigger>
                <AccordionContent>{t(`items.${key}.a`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

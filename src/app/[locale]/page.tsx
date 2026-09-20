import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/hero';
import { TechMarquee } from '@/components/sections/tech-marquee';
import { Courses } from '@/components/sections/courses';
import { WhyUs } from '@/components/sections/why-us';
import { Stats } from '@/components/sections/stats';
import { Process } from '@/components/sections/process';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { FAQ_KEYS } from '@/lib/faq';
import { CtaBanner } from '@/components/sections/cta-banner';
import { Contact } from '@/components/sections/contact';
import { FloatingCta } from '@/components/floating-cta';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  // FAQPage structured data — qidiruv natijalarida savol-javob ko'rinishi uchun
  const tFaq = await getTranslations({ locale, namespace: 'Faq' });
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: tFaq(`items.${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: tFaq(`items.${key}.a`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <TechMarquee />
      <Courses />
      <WhyUs />
      <Stats />
      <Process />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <Contact />
      <FloatingCta />
    </>
  );
}

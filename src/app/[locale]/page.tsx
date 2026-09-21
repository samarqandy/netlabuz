import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/hero';
import { TechMarquee } from '@/components/sections/tech-marquee';
import { Courses } from '@/components/sections/courses';
import { Quiz } from '@/components/sections/quiz';
import { Tracks } from '@/components/sections/tracks';
import { Mentors } from '@/components/sections/mentors';
import { WhyUs } from '@/components/sections/why-us';
import { Lab } from '@/components/sections/lab';
import { Stats } from '@/components/sections/stats';
import { Process } from '@/components/sections/process';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { FAQ_KEYS } from '@/lib/faq';
import { CtaBanner } from '@/components/sections/cta-banner';
import { Contact } from '@/components/sections/contact';
import { FloatingCta } from '@/components/floating-cta';
import { COURSES } from '@/lib/courses';
import { COURSE_DETAILS } from '@/lib/course-details';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { ORG, safeJsonLd } from '@/lib/org';

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

  // Course structured data — ItemList karuseli: har element o'z kurs
  // sahifasiga ishora qiladi (Google unikal URL talab qiladi).
  // Tashkilot ma'lumotlari layout'dagi EducationalOrganization'ga @id orqali
  // bog'lanadi (NAP takrorlanmaydi).
  const tCourses = await getTranslations({ locale, namespace: 'Courses' });
  const coursesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: COURSES.map((course, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: tCourses(`items.${course.id}.name`),
        description: tCourses(`items.${course.id}.description`),
        url: `${ORG.url}${getPathname({
          locale: locale as Locale,
          href: {
            pathname: '/courses/[slug]',
            params: { slug: COURSE_DETAILS[course.id].slug },
          },
        })}`,
        provider: { '@id': `${ORG.url}/#organization` },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(coursesJsonLd) }}
      />
      <Hero />
      <TechMarquee />
      <Courses />
      <Tracks />
      <Quiz />
      <WhyUs />
      <Lab />
      <Stats />
      <Process />
      <Mentors />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <Contact />
      <FloatingCta />
    </>
  );
}

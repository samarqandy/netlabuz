import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/hero';
import { TechMarquee } from '@/components/sections/tech-marquee';
import { Courses } from '@/components/sections/courses';
import { Quiz } from '@/components/sections/quiz';
import { Mentors } from '@/components/sections/mentors';
import { WhyUs } from '@/components/sections/why-us';
import { Stats } from '@/components/sections/stats';
import { Process } from '@/components/sections/process';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { FAQ_KEYS } from '@/lib/faq';
import { CtaBanner } from '@/components/sections/cta-banner';
import { Contact } from '@/components/sections/contact';
import { FloatingCta } from '@/components/floating-cta';
import { COURSES } from '@/lib/courses';
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

  // Course structured data — har kurs alohida Course obyekti sifatida.
  // Eslatma: ItemList karuseli har kursga alohida sahifa talab qiladi;
  // per-kurs sahifalar qo'shilganda ItemList + unikal url'larga o'tkaziladi.
  // Tashkilot ma'lumotlari layout'dagi EducationalOrganization'ga @id orqali
  // bog'lanadi (NAP takrorlanmaydi).
  const tCourses = await getTranslations({ locale, namespace: 'Courses' });
  const coursesJsonLd = COURSES.map((course) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: tCourses(`items.${course.id}.name`),
    description: tCourses(`items.${course.id}.description`),
    provider: { '@id': `${ORG.url}/#organization` },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      location: {
        '@type': 'Place',
        name: ORG.name,
        address: ORG.address,
      },
    },
  }));

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
      <Quiz />
      <WhyUs />
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

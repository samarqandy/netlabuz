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

  // Course structured data — kurslar qidiruvda alohida ko'rinishi uchun
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
        url: `https://netlab.uz/${locale}#courses`,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'NETLAB',
          sameAs: 'https://netlab.uz',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Onsite',
          location: {
            '@type': 'Place',
            name: 'NETLAB',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Dahbed 11',
              addressLocality: 'Samarqand',
              addressCountry: 'UZ',
            },
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
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

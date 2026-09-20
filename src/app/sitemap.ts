import type { MetadataRoute } from 'next';

import { routing, type Locale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { COURSE_DETAILS } from '@/lib/course-details';
import { ORG } from '@/lib/org';

const BASE_URL = ORG.url;

/**
 * Sitemap (/sitemap.xml) — bosh sahifa + har bir kurs sahifasi,
 * uch tilda. Har yozuvda hreflang alternates (i18n SEO).
 * Kurs yo'llari tilga moslashgan: /uz/kurslar/..., /ru/kursy/..., /en/courses/...
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Bosh sahifa
  const homeLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, `${BASE_URL}/${l}`])
  );
  const home: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: { languages: homeLanguages },
  }));

  // Kurs sahifalari
  const courses: MetadataRoute.Sitemap = Object.values(COURSE_DETAILS).flatMap(
    (detail) => {
      const href = { pathname: '/courses/[slug]' as const, params: { slug: detail.slug } };
      const languages = Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}${getPathname({ locale: l, href })}`])
      );
      return routing.locales.map((locale) => ({
        url: `${BASE_URL}${getPathname({ locale: locale as Locale, href })}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: { languages },
      }));
    }
  );

  return [...home, ...courses];
}

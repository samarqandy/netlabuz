import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';

const BASE_URL = 'https://netlab.uz';

/**
 * Sitemap — Next.js App Router konvensiyasi (/sitemap.xml).
 * Hozir sayt single-page: faqat 3 til bosh sahifasi mavjud.
 * Har bir yozuvga hreflang alternates qo'shilgan (i18n SEO).
 *
 * Kelajakda alohida sahifalar (masalan /uz/kurslar) qo'shilsa,
 * shu yerga real route bilan birga qo'shamiz.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${BASE_URL}/${l}`])
  );

  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: { languages },
  }));
}

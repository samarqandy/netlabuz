import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Qo'llab-quvvatlanadigan tillar
  locales: ['uz', 'ru', 'en'],
  // Standart til
  defaultLocale: 'uz',
  // URL strukturasi: /uz, /ru, /en (har doim prefiks bilan)
  localePrefix: 'always',
  // Tilga moslashgan yo'llar (SEO): /uz/kurslar/..., /ru/kursy/..., /en/courses/...
  pathnames: {
    '/': '/',
    '/courses/[slug]': {
      uz: '/kurslar/[slug]',
      ru: '/kursy/[slug]',
      en: '/courses/[slug]',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

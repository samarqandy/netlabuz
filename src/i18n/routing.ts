import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Qo'llab-quvvatlanadigan tillar
  locales: ['uz', 'ru', 'en'],
  // Standart til
  defaultLocale: 'uz',
  // URL strukturasi: /uz, /ru, /en (har doim prefiks bilan)
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

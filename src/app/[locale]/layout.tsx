import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';

import { routing, type Locale } from '@/i18n/routing';
import { ORG, safeJsonLd } from '@/lib/org';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/components/motion-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Scene } from '@/components/scene/scene';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

// Terminal/kod aksentlari uchun monospace shrift
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Brauzer UI rangi — sayt standart holatda dark (next-themes defaultTheme),
// shuning uchun OS sozlamasidan qat'i nazar dark rang beriladi.
export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta' });

  // OG standarti til kodini `xx_XX` ko'rinishida talab qiladi
  const ogLocale = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' }[locale] ?? 'uz_UZ';

  return {
    metadataBase: new URL('https://netlab.uz'),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uz: '/uz',
        ru: '/ru',
        en: '/en',
        'x-default': '/uz',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://netlab.uz/${locale}`,
      siteName: 'NETLAB',
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Til validatsiyasi
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Statik renderingni yoqamiz
  setRequestLocale(locale);

  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });

  // Structured Data — qidiruv tizimlari uchun (EducationalOrganization)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${ORG.url}/#organization`,
    name: ORG.name,
    alternateName: 'NETLAB Samarqand',
    url: `${ORG.url}/${locale}`,
    logo: `${ORG.url}/uz/opengraph-image`,
    description: tMeta('description'),
    telephone: ORG.phone,
    address: ORG.address,
    sameAs: ORG.telegramChannels.map((ch) => ch.href),
    // Asoschi — shaxsiy sayti orqali entity sifatida bog'lanadi
    founder: {
      '@type': 'Person',
      name: ORG.founder.name,
      url: ORG.founder.site,
      sameAs: [ORG.founder.site],
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Scene />
          <NextIntlClientProvider messages={messages}>
            <MotionProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

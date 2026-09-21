import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  Clock,
  GraduationCap,
  Languages,
  MapPin,
  Target,
  UserCheck,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { routing, type Locale } from '@/i18n/routing';
import { Link, getPathname } from '@/i18n/navigation';
import { ACTIVE_COURSES, GLOW_TEXT } from '@/lib/courses';
import {
  COURSE_DETAILS,
  COURSE_DETAIL_ENTRIES,
  SLUG_TO_ID,
} from '@/lib/course-details';
import { ORG, safeJsonLd } from '@/lib/org';
import { formatPrice, PRICE_CURRENCY } from '@/lib/price';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Curriculum } from '@/components/course/curriculum';
import { CourseCta } from '@/components/course/course-cta';
import { FloatingCta } from '@/components/floating-cta';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COURSE_DETAIL_ENTRIES.map(([, detail]) => ({
      locale,
      slug: detail.slug,
    }))
  );
}

/** Slug bo'yicha kursni topadi (topilmasa null) */
function findCourse(slug: string) {
  const id = SLUG_TO_ID[slug];
  if (!id) return null;
  const course = ACTIVE_COURSES.find((c) => c.id === id);
  const detail = COURSE_DETAILS[id];
  // Tayyorlanayotgan kursda dastur yo'q — sahifa ham ochilmaydi (404)
  if (!course || !detail) return null;
  return { id, course, detail };
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: Params;
}): Promise<Metadata> {
  const found = findCourse(slug);
  if (!found) return {};

  const t = await getTranslations({ locale, namespace: 'Courses' });
  const td = await getTranslations({ locale, namespace: 'CourseDetail' });

  const name = t(`items.${found.id}.name`);
  const title = `${name} — ${td('metaTitleSuffix')}`;
  const description = td(`${found.id}.tagline`);

  // Tilga moslashgan kanonik/alternativ havolalar
  const href = { pathname: '/courses/[slug]' as const, params: { slug } };
  const canonical = getPathname({ locale: locale as Locale, href });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href })])
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ...languages, 'x-default': languages.uz },
    },
    openGraph: {
      title,
      description,
      url: `${ORG.url}${canonical}`,
      siteName: ORG.name,
      type: 'article',
    },
  };
}

export default async function CoursePage({
  params: { locale, slug },
}: {
  params: Params;
}) {
  const found = findCourse(slug);
  if (!found) notFound();

  setRequestLocale(locale);
  const { id, course, detail } = found;

  const t = await getTranslations({ locale, namespace: 'Courses' });
  const td = await getTranslations({ locale, namespace: 'CourseDetail' });

  const name = t(`items.${id}.name`);
  const Icon = course.icon;
  const canonical = getPathname({
    locale: locale as Locale,
    href: { pathname: '/courses/[slug]', params: { slug } },
  });

  // Qisqa kurs soatlarda, kasb dasturi oylarda o'lchanadi
  const isShort = course.hours !== undefined;
  const duration = isShort
    ? t('durationHours', { hours: course.hours })
    : t('duration', { months: course.months });

  const META = [
    { Icon: Clock, label: td('metaDuration'), value: duration },
    // Narx faqat `priceFrom` kiritilgan kursda ko'rinadi
    ...(course.priceFrom !== undefined
      ? [
          {
            Icon: Wallet,
            label: td(isShort ? 'metaPriceCourse' : 'metaPrice'),
            value: t('priceValue', { price: formatPrice(course.priceFrom) }),
          },
        ]
      : []),
    { Icon: GraduationCap, label: td('metaLevel'), value: t(course.level) },
    { Icon: MapPin, label: td('metaFormat'), value: td('metaFormatValue') },
    { Icon: Languages, label: td('metaLanguage'), value: td('metaLanguageValue') },
    { Icon: Award, label: td('metaCertificate'), value: td('metaCertificateValue') },
  ];

  // Structured data — kursning o'z URL'i bilan (qidiruv uchun)
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name,
      description: td(`${id}.tagline`),
      url: `${ORG.url}${canonical}`,
      inLanguage: locale,
      provider: { '@id': `${ORG.url}/#organization` },
      teaches: detail.outcomes.map((key) => td(`${id}.outcomes.${key}`)),
      syllabusSections: detail.modules.map((m, i) => ({
        '@type': 'Syllabus',
        position: i + 1,
        name: td(`${id}.modules.${m.key}`),
      })),
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Onsite',
        courseWorkload: isShort ? `PT${course.hours}H` : `P${course.months}M`,
        location: {
          '@type': 'Place',
          name: ORG.name,
          address: ORG.address,
        },
      },
      // Narx tasdiqlangan bo'lsagina offers qo'shiladi (Google
      // tasdiqlanmagan narxni noto'g'ri deb belgilaydi)
      ...(course.priceFrom !== undefined
        ? {
            offers: {
              '@type': 'Offer',
              category: 'Paid',
              availability: 'https://schema.org/InStock',
              url: `${ORG.url}${canonical}`,
              price: course.priceFrom,
              priceCurrency: PRICE_CURRENCY,
              // Kasb dasturida narx oylik — UN/CEFACT 'MON' birligi bilan
              // aniqlashtiriladi. Qisqa kursda narx kurs uchun to'liq.
              ...(isShort
                ? {}
                : {
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: course.priceFrom,
                      priceCurrency: PRICE_CURRENCY,
                      unitCode: 'MON',
                      billingDuration: 1,
                      billingIncrement: 1,
                    },
                  }),
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: td('breadcrumbHome'),
          item: `${ORG.url}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: td('breadcrumbCourses'),
          item: `${ORG.url}/${locale}#courses`,
        },
        { '@type': 'ListItem', position: 3, name },
      ],
    },
  ];

  // O'xshash kurslar — faqat sahifasi bor (ishga tushgan) kurslar
  const related = ACTIVE_COURSES.flatMap((c) => {
    const d = COURSE_DETAILS[c.id];
    return c.id !== id && d ? [{ course: c, detail: d }] : [];
  }).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-20 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[130px]"
        />

        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  {td('breadcrumbHome')}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <a
                  href={`/${locale}#courses`}
                  className="transition-colors hover:text-foreground"
                >
                  {td('breadcrumbCourses')}
                </a>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{name}</li>
            </ol>
          </nav>

          <Reveal className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'grid size-16 shrink-0 place-items-center rounded-2xl border border-border bg-secondary/40',
                  GLOW_TEXT[course.glow]
                )}
              >
                <Icon className="size-8" strokeWidth={1.75} />
              </span>
              <Badge variant={course.level}>{t(course.level)}</Badge>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              {name}
            </h1>
            <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
              {td(`${id}.tagline`)}
            </p>

            <div className="mt-8">
              <CourseCta courseId={id} locale={locale} location="course_hero" />
            </div>
          </Reveal>

          {/* Meta panel */}
          <Reveal variant="fadeIn" className="mt-12">
            {/* Narx qo'shilganda 6 ta katak bo'ladi — 5 ustunda oxirgi qator
                bo'sh qolmasligi uchun ustunlar soni moslashadi */}
            <dl
              className={cn(
                'grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3',
                META.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-5'
              )}
            >
              {META.map(({ Icon: MetaIcon, label, value }, i) => (
                <div
                  key={label}
                  className={cn(
                    'flex flex-col gap-1 bg-card px-5 py-5',
                    // 5 ta element — tor ekranlarda oxirgisi bo'sh katak
                    // qoldirmasligi uchun qatorni to'ldiradi
                    i === META.length - 1 && 'col-span-2 sm:col-span-2 lg:col-span-1'
                  )}
                >
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <MetaIcon className="size-3.5" /> {label}
                  </dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ Natijalar */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <Reveal>
            <SectionHeading align="left" title={td('outcomesTitle')} />
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {detail.outcomes.map((key) => (
              <StaggerItem
                key={key}
                className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4"
              >
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <span className="text-sm text-muted-foreground">
                  {td(`${id}.outcomes.${key}`)}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* --------------------------------------------------- Kurs dasturi */}
      <section className="border-y border-border/60 bg-secondary/20 py-20 sm:py-24">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <SectionHeading
                align="left"
                title={td('curriculumTitle')}
                subtitle={td('curriculumSubtitle', {
                  count: detail.modules.length,
                })}
              />
            </Reveal>
            <Reveal variant="fadeIn" className="mt-10">
              <Curriculum courseId={id} />
            </Reveal>

            {/* Texnologiyalar */}
            <Reveal variant="fadeIn" className="mt-12">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {td('toolsTitle')}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {detail.tools.map((tool) => (
                  <li
                    key={tool}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-sm text-muted-foreground"
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-accent/70" />
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Yopishuvchi yozilish kartasi (desktop) */}
          <Reveal variant="fadeIn" className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight">
                {td('bottomCtaTitle')}
              </h3>
              <dl className="mt-5 space-y-3 border-y border-border/60 py-5 text-sm">
                {META.map(({ Icon: MetaIcon, label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-muted-foreground">
                      <MetaIcon className="size-4" /> {label}
                    </dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5">
                <CourseCta
                  courseId={id}
                  locale={locale}
                  location="course_sidebar"
                  size="default"
                  stacked
                />
              </div>
              <a
                href={`tel:${ORG.phone}`}
                className="mt-4 block text-center font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {ORG.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Kim uchun / Talablar / Karyera */}
      <section className="py-20 sm:py-24">
        <div className="container grid gap-6 lg:grid-cols-3">
          <InfoCard
            Icon={UserCheck}
            title={td('audienceTitle')}
            items={detail.audience.map((key) => td(`${id}.audience.${key}`))}
          />
          <InfoCard
            Icon={Target}
            title={td('requirementsTitle')}
            items={detail.requirements.map((key) =>
              td(`${id}.requirements.${key}`)
            )}
          />
          <InfoCard
            Icon={GraduationCap}
            title={td('rolesTitle')}
            items={detail.roles.map((key) => td(`${id}.roles.${key}`))}
          />
        </div>
      </section>

      {/* -------------------------------------------------------- CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="container">
          <Reveal variant="scaleIn">
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/10 px-6 py-12 text-center sm:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/20 blur-[100px]"
              />
              <h2 className="relative text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
                {td('bottomCtaTitle')}
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                {td('bottomCtaSubtitle')}
              </p>
              <div className="relative mt-7 flex justify-center">
                <CourseCta
                  courseId={id}
                  locale={locale}
                  location="course_bottom"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------- Boshqa kurslar */}
      <section className="border-t border-border/60 py-20 sm:py-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" title={td('relatedTitle')} />
            <a
              href={`/${locale}#courses`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" /> {td('backToCourses')}
            </a>
          </div>

          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(({ course: rc, detail: rd }) => {
              const RelatedIcon = rc.icon;
              return (
                <StaggerItem key={rc.id} className="h-full">
                  <GlowCard glow={rc.glow} className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={cn(
                          'grid size-12 place-items-center rounded-xl border border-border bg-secondary/40',
                          GLOW_TEXT[rc.glow]
                        )}
                      >
                        <RelatedIcon className="size-6" strokeWidth={1.75} />
                      </span>
                      <Badge variant={rc.level}>{t(rc.level)}</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-bold tracking-tight">
                      {t(`items.${rc.id}.name`)}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {t(`items.${rc.id}.description`)}
                    </p>
                    <Link
                      href={{
                        pathname: '/courses/[slug]',
                        params: { slug: rd.slug },
                      }}
                      className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                    >
                      {t('detailsCta')}
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </GlowCard>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      <FloatingCta />
    </>
  );
}

/** Kim uchun / Talablar / Karyera kartasi */
function InfoCard({
  Icon,
  title,
  items,
}: {
  Icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
        <span className="grid size-11 place-items-center rounded-xl border border-border bg-secondary/40 text-accent">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
        <ul className="mt-4 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span
                aria-hidden
                className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

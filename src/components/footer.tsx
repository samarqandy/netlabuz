import { useLocale, useTranslations } from 'next-intl';
import { Phone, MapPin, Send } from 'lucide-react';

import { COURSE_DETAIL_ENTRIES } from '@/lib/course-details';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/brand/logo';
import { ORG } from '@/lib/org';

const PHONE = ORG.phone;
const TELEGRAM_CHANNELS = ORG.telegramChannels;

const NAV_LINKS = [
  { href: '#courses', key: 'courses' },
  { href: '#path', key: 'path' },
  { href: '#quiz', key: 'quiz' },
  { href: '#why', key: 'why' },
  { href: '#how', key: 'how' },
  { href: '#faq', key: 'faq' },
  { href: '#contact', key: 'contact' },
] as const;

export function Footer() {
  const t = useTranslations('Footer');
  const tn = useTranslations('Nav');
  const tc = useTranslations('Courses');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo markClassName="h-9" wordClassName="text-xl" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t('about')}
            </p>
            <div className="mt-5 flex gap-2">
              {TELEGRAM_CHANNELS.map((ch) => (
                <a
                  key={ch.href}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Telegram ${ch.label}`}
                  className="grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <Send className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigatsiya */}
          <nav className="lg:col-span-3" aria-label={t('navTitle')}>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {t('navTitle')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.key}>
                  <a
                    href={`/${locale}${l.href}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tn(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kurslar */}
          <nav className="lg:col-span-2" aria-label={t('coursesTitle')}>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {t('coursesTitle')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COURSE_DETAIL_ENTRIES.map(([id, detail]) => (
                <li key={id}>
                  <Link
                    href={{
                      pathname: '/courses/[slug]',
                      params: { slug: detail.slug },
                    }}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tc(`items.${id}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Aloqa */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {t('contactTitle')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0 text-accent" />
                  {PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                {t('address')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} NETLAB. {t('rights')}
          </p>
          <p>{t('tagline')}</p>
        </div>
      </div>
    </footer>
  );
}

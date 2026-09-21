'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import { track } from '@/lib/track';
import { ORG } from '@/lib/org';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';

const PHONE = ORG.phone;

const NAV_ITEMS = [
  { href: '#courses', key: 'courses' },
  { href: '#path', key: 'path' },
  { href: '#quiz', key: 'quiz' },
  { href: '#why', key: 'why' },
  { href: '#mentors', key: 'mentors' },
  { href: '#how', key: 'how' },
  { href: '#faq', key: 'faq' },
  { href: '#contact', key: 'contact' },
] as const;

// Modul darajasida — har render'da yangi massiv yaratilmasin
// (aks holda useActiveSection effekti observer'ni qayta quradi)
const SECTION_IDS = NAV_ITEMS.map((i) => i.href.slice(1));

/** Scrollspy — ekranda qaysi seksiya faolligini kuzatadi */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.intersectionRatio);
        let best: string | null = null;
        let bestR = 0.05; // hech biri ko'rinmasa — faol yo'q (hero)
        ratios.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            best = id;
          }
        });
        setActive(best);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );
    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

export function Navbar() {
  const t = useTranslations('Nav');
  // Havolalar to'liq yo'l bilan: kurs sahifasidan ham bosh sahifa
  // bo'limlariga o'tadi (bosh sahifada esa oddiy scroll bo'lib qoladi)
  const locale = useLocale();
  const hrefFor = (hash: string) => `/${locale}${hash}`;
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const active = useActiveSection(SECTION_IDS);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/80 shadow-lg backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="NETLAB"
          className="transition-opacity duration-200 hover:opacity-80"
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.key}>
                <a
                  href={hrefFor(item.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(item.key)}
                  {/* Faol seksiya indikatori */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-accent transition-opacity duration-200',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="accent" size="sm" className="ml-1 hidden sm:inline-flex">
            <a
              href={hrefFor('#contact')}
              onClick={() => track('cta_click', { location: 'navbar' })}
            >
              {t('cta')}
            </a>
          </Button>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-md xl:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a
                    href={hrefFor(item.href)}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2">
                <Button asChild variant="accent">
                  <a
                    href={hrefFor('#contact')}
                    onClick={() => {
                      setOpen(false);
                      track('cta_click', { location: 'navbar_mobile' });
                    }}
                  >
                    {t('cta')}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={`tel:${PHONE}`}>
                    <Phone className="size-4" /> {PHONE}
                  </a>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

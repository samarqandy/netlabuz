'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { track } from '@/lib/track';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';

const PHONE = '+998936803113';

const NAV_ITEMS = [
  { href: '#courses', key: 'courses' },
  { href: '#quiz', key: 'quiz' },
  { href: '#why', key: 'why' },
  { href: '#how', key: 'how' },
  { href: '#faq', key: 'faq' },
  { href: '#contact', key: 'contact' },
] as const;

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
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const active = useActiveSection(NAV_ITEMS.map((i) => i.href.slice(1)));

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
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
          aria-label="NETLAB"
        >
          <span className="text-gradient-tech">NET</span>
          <span className="-ml-2">LAB</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.key}>
                <a
                  href={item.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
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
              href="#contact"
              onClick={() => track('cta_click', { location: 'navbar' })}
            >
              {t('cta')}
            </a>
          </Button>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-md lg:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2">
                <Button asChild variant="accent">
                  <a href="#contact" onClick={() => setOpen(false)}>
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

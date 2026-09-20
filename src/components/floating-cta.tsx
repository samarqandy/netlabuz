'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';

import { track } from '@/lib/track';

const TELEGRAM = 'https://t.me/netlabuz';

/**
 * Suzuvchi Telegram tugmasi — O'zbekiston bozorida asosiy aloqa kanali.
 * Hero ko'rinib turganda yashirin; scroll boshlangach paydo bo'ladi.
 */
export function FloatingCta() {
  const t = useTranslations('Floating');
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="tg"
          href={TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('telegram')}
          title={t('telegram')}
          onClick={() => track('telegram_click', { location: 'floating' })}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow transition-transform hover:scale-105 sm:bottom-8 sm:right-8"
        >
          {/* Pulsatsiya halqasi */}
          <span
            aria-hidden
            className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-30 motion-reduce:hidden"
          />
          <Send className="relative size-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

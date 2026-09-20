'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

/* =========================================================================
 * Terminal — hero uchun "jonli" terminal oynasi.
 * `whoami` natijasida kasblar ketma-ket yozilib-o'chiriladi (typewriter).
 * Reduced-motion: animatsiyasiz, birinchi kasb statik ko'rsatiladi.
 * ========================================================================= */

interface TerminalProps {
  title: string;
  /** Aylanib turadigan kasb nomlari */
  roles: string[];
  className?: string;
}

const TYPE_MS = 65;
const ERASE_MS = 30;
const HOLD_MS = 1800;

function useTypewriter(words: string[], enabled: boolean) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState(enabled ? '' : words[0] ?? '');
  const [erasing, setErasing] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    const word = words[index % words.length] ?? '';

    let timer: ReturnType<typeof setTimeout>;
    if (!erasing && text.length < word.length) {
      timer = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS);
    } else if (!erasing && text.length === word.length) {
      timer = setTimeout(() => setErasing(true), HOLD_MS);
    } else if (erasing && text.length > 0) {
      timer = setTimeout(() => setText(text.slice(0, -1)), ERASE_MS);
    } else {
      timer = setTimeout(() => {
        setErasing(false);
        setIndex((i) => (i + 1) % words.length);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [enabled, words, index, text, erasing]);

  return text;
}

export function Terminal({ title, roles, className }: TerminalProps) {
  const reduce = useReducedMotion();
  const typed = useTypewriter(roles, !reduce);

  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-[#0d1117]/90 font-mono text-[13px] leading-relaxed shadow-2xl backdrop-blur sm:text-sm',
        className
      )}
    >
      {/* Sarlavha paneli */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/40 px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-xs text-muted-foreground">{title}</span>
      </div>

      {/* Tana */}
      <div className="space-y-1.5 px-4 py-4 text-left sm:px-5 sm:py-5">
        <p>
          <span className="text-accent">netlab@smq</span>
          <span className="text-muted-foreground">:~$</span>{' '}
          <span className="text-foreground">whoami</span>
        </p>
        <p className="text-primary-glow">
          {typed}
          <span className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-accent motion-safe:animate-pulse" />
        </p>
        <p className="pt-1.5">
          <span className="text-accent">netlab@smq</span>
          <span className="text-muted-foreground">:~$</span>{' '}
          <span className="text-foreground">ls skills/</span>
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground">
          <span>cisco/</span>
          <span>linux/</span>
          <span>voip/</span>
          <span>cctv/</span>
          <span>iot/</span>
        </p>
        <p className="pt-1.5">
          <span className="text-accent">netlab@smq</span>
          <span className="text-muted-foreground">:~$</span>{' '}
          <span className="text-foreground">ping netlab.uz</span>
        </p>
        <p className="text-muted-foreground">
          64 bytes from netlab.uz: ttl=64 time=1.2 ms{' '}
          <span className="text-accent">✔</span>
        </p>
      </div>
    </div>
  );
}

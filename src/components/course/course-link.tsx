'use client';

import * as React from 'react';

import { Link, useRouter } from '@/i18n/navigation';

/** Kurs sahifasi va kartasi o'rtasidagi morf uchun umumiy nom */
export const COURSE_VT_NAME = 'course-hero';

type Href = Parameters<typeof Link>[0]['href'];

interface Props {
  href: Href;
  /** Morf qilinadigan element — havolaning qaysi ajdodi (CSS selektor) */
  morphFrom?: string;
  onNavigate?: () => void;
  className?: string;
  children: React.ReactNode;
}

type VTDocument = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<unknown> };
};

/** Navigatsiya yakunlanishini kutadi (cheklangan vaqt bilan) */
async function waitForNavigation(from: string, timeout = 700) {
  const start = performance.now();
  while (window.location.pathname === from && performance.now() - start < timeout) {
    await new Promise((r) => requestAnimationFrame(r));
  }
  // yangi sahifa chizilishi uchun bitta kadr
  await new Promise((r) => requestAnimationFrame(r));
}

/**
 * Kurs havolasi — View Transitions bilan.
 *
 * Bosilganda karta "yoyilib" kurs sahifasining sarlavhasiga aylanadi: sahifa
 * qayta yuklanmaydi, ikki holat o'rtasida native morf bo'ladi.
 *
 * Brauzer qo'llab-quvvatlamasa, reduced-motion yoqilgan bo'lsa yoki
 * navigatsiya cho'zilib ketsa — oddiy havola sifatida ishlaydi.
 */
export const CourseLink = React.forwardRef<HTMLAnchorElement, Props>(function CourseLink(
  { href, morphFrom, onNavigate, className, children },
  forwardedRef
) {
  const router = useRouter();
  const ref = React.useRef<HTMLAnchorElement | null>(null);
  // Radix `asChild` ref uzatadi — ikkalasini ham ushlab turamiz
  const setRef = React.useCallback(
    (node: HTMLAnchorElement | null) => {
      ref.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    const doc = document as VTDocument;
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || modified || reduced) return;

    e.preventDefault();
    const card = morphFrom
      ? (ref.current?.closest(morphFrom) as HTMLElement | null)
      : null;
    if (card) card.style.viewTransitionName = COURSE_VT_NAME;

    const from = window.location.pathname;
    const transition = doc.startViewTransition(async () => {
      router.push(href as never);
      await waitForNavigation(from);
    });
    transition.finished.catch(() => {}).finally(() => {
      if (card) card.style.viewTransitionName = '';
    });
  };

  return (
    <Link ref={setRef} href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
});

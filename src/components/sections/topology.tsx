'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import {
  TOPOLOGY_LINKS,
  TOPOLOGY_NODES,
  TOPOLOGY_VIEWBOX,
} from '@/lib/topology';
import { COURSES } from '@/lib/courses';
import { COURSE_DETAILS } from '@/lib/course-details';
import { formatPrice } from '@/lib/price';
import { Link } from '@/i18n/navigation';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';

/**
 * Jonli topologiya — hero'dan keyingi birinchi bo'lim.
 *
 * Laboratoriya sxemasi o'zini chizadi, magistral bo'ylab paket yuguradi.
 * Har tugun bitta kursga bog'langan: ustiga kelganda yoki bosilganda pastdagi
 * panelda kurs nomi, narxi va havolasi chiqadi — ya'ni bu bezak emas,
 * katalogga kirish nuqtasi.
 */
export function Topology() {
  const t = useTranslations('Topology');
  const tc = useTranslations('Courses');
  const [active, setActive] = React.useState<string | null>(null);
  const [run, setRun] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);

  // Chizilish animatsiyasi faqat bo'lim ko'ringanda boshlanadi
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const course = active ? COURSES.find((c) => c.id === active) : undefined;
  const detail = course ? COURSE_DETAILS[course.id] : undefined;

  return (
    <section
      id="map"
      className="scroll-mt-20 border-b border-border/60 py-16 sm:py-20"
    >
      <div className="container">
        <Reveal variant="fadeIn">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </Reveal>

        {/* Diagramma: tor ekranda surib ko'riladi */}
        <div
          ref={boxRef}
          data-run={run}
          className="relative mt-8 overflow-x-auto overflow-y-hidden rounded-2xl border border-border bg-card p-3 shadow-sm"
        >
          <svg
            viewBox={TOPOLOGY_VIEWBOX}
            role="img"
            aria-label={t('alt')}
            className="block h-auto w-full min-w-[660px] sm:min-w-0"
          >
            <defs>
              <linearGradient id="netlab-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
              </linearGradient>
            </defs>

            {TOPOLOGY_LINKS.map((link, i) => (
              <path
                key={link.d}
                d={link.d}
                className="topo-link fill-none stroke-border"
                strokeWidth={1.6}
                style={{ ['--len' as string]: link.len, ['--i' as string]: i }}
              />
            ))}

            {/* Magistral bo'ylab yuguruvchi yorug'lik */}
            {TOPOLOGY_LINKS.filter((l) => l.beam).map((link) => (
              <path
                key={`beam-${link.d}`}
                d={link.d}
                className="topo-beam fill-none"
                stroke="url(#netlab-beam)"
                strokeWidth={2.2}
              />
            ))}

            {TOPOLOGY_NODES.map((node, i) => {
              const on = active === node.id;
              const scale = node.r >= 30 ? 1.05 : 0.92;
              return (
                <g
                  key={node.id}
                  className="topo-node cursor-pointer"
                  style={{ ['--i' as string]: i }}
                  tabIndex={0}
                  role="button"
                  aria-label={tc(`items.${node.id}.name`)}
                  onMouseEnter={() => setActive(node.id)}
                  onFocus={() => setActive(node.id)}
                  onClick={() => setActive(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActive(node.id);
                    }
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    className={cn(
                      'transition-colors duration-200',
                      on ? 'fill-accent/10 stroke-accent' : 'fill-secondary/40 stroke-border'
                    )}
                    strokeWidth={1.4}
                  />
                  <g
                    transform={`translate(${node.x} ${node.y}) scale(${scale}) translate(-12 -12)`}
                    className={cn(
                      'fill-none transition-colors duration-200',
                      on ? 'stroke-accent' : 'stroke-tech-clay'
                    )}
                    strokeWidth={2.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: node.icon }}
                  />
                  <text
                    x={node.x}
                    y={node.y + node.r + 18}
                    textAnchor="middle"
                    className={cn(
                      'font-mono text-[10.5px] transition-colors duration-200',
                      on ? 'fill-foreground' : 'fill-muted-foreground'
                    )}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tanlangan tugun — kurs kartasi */}
        <div
          aria-live="polite"
          className="mt-3 flex min-h-[4.5rem] flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-border bg-card px-5 py-4"
        >
          {course ? (
            <>
              <span className="font-bold">{tc(`items.${course.id}.name`)}</span>
              {course.priceFrom !== undefined && (
                <span className="font-mono text-sm text-accent">
                  {tc(course.hours !== undefined ? 'priceCourse' : 'priceFrom', {
                    price: formatPrice(course.priceFrom),
                  })}
                </span>
              )}
              {detail && (
                <Link
                  href={{
                    pathname: '/courses/[slug]',
                    params: { slug: detail.slug },
                  }}
                  onClick={() =>
                    track('course_open', { course: course.id, source: 'topology' })
                  }
                  className="group ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                >
                  {tc('detailsCta')}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              )}
              <p className="w-full text-sm text-muted-foreground">
                {tc(`items.${course.id}.description`)}
              </p>
            </>
          ) : (
            <>
              <span className="font-bold">{t('emptyTitle')}</span>
              <p className="w-full text-sm text-muted-foreground">{t('emptyHint')}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

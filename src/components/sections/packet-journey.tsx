'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import {
  JOURNEY_NODES,
  JOURNEY_STEPS,
  JOURNEY_TOTAL,
  JOURNEY_X,
  JOURNEY_Y,
  journeyStepAt,
} from '@/lib/packet-journey';
import { COURSE_DETAILS } from '@/lib/course-details';
import { Link } from '@/i18n/navigation';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

const R = 46;
const LAST = JOURNEY_STEPS.length - 1;
const X = JOURNEY_X;
const Y = JOURNEY_Y;
const pad = (n: number) => String(n).padStart(2, '0');

// Telefonda SVG ~0.34 marta kichrayadi: yozuvlar o'qiladigan bo'lishi uchun
// shriftlar va paket yorlig'i kattaroq, "INTERNET" yozuvi esa sig'maydi —
// uni o'rta punktir chiziq va guruh sarlavhalari ifodalaydi.
const SIZES = {
  wide: { cap: 13, capTrack: '0.18em', capY: 26, lineY: 40, label: 14, labelTrack: '0.12em', labelDy: 30, tagScale: 1, tagDy: 22 },
  compact: { cap: 26, capTrack: '0.06em', capY: 24, lineY: 34, label: 28, labelTrack: '0', labelDy: 38, tagScale: 1.6, tagDy: 24 },
} as const;

function useCompact() {
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return compact;
}

/**
 * "Paket yo'li" — scroll bilan o'ynaydigan sahna: bitta so'rov ofisdagi
 * kompyuterdan internet orqali serverga borib, javob qaytadi. Har qadam
 * o'sha qurilma bilan ishlashni o'rgatadigan kurs moduliga bog'langan.
 *
 * Arxitektura:
 *   - Sahnani ekranda CSS `sticky` ushlab turadi, GSAP'ning `pin`'i emas.
 *     Scroll uchun joy oldindan band — GSAP kech yuklansa ham sahifa
 *     siljimaydi (layout shift yo'q).
 *   - GSAP + ScrollTrigger (~41 KB) faqat bo'lim yaqinlashganda dinamik
 *     yuklanadi, bosh sahifaning birinchi yuklanishiga kirmaydi.
 *   - `scrub` silliqlashi paketni scroll'dan biroz kechiktirib, yumshoq
 *     harakat beradi — telefonda ham. Lenis kerak bo'lmadi: u butun sahifa
 *     scroll'ini o'z qo'liga oladi, sukut bo'yicha esa telefonda ishlamaydi.
 *   - Faol qadam (karta, tugun rangi) React holatida; GSAP faqat uzluksiz
 *     harakatni (paket, to'lgan chiziq) boshqaradi.
 *   - `prefers-reduced-motion`: GSAP umuman yuklanmaydi, hamma qadam oddiy
 *     ro'yxat bo'lib ko'rinadi (faqat CSS, hydration farqi yo'q).
 */
export function PacketJourney() {
  const t = useTranslations('PacketJourney');
  const tc = useTranslations('Courses');
  const td = useTranslations('CourseDetail');
  const [active, setActive] = React.useState(0);
  const compact = useCompact();
  const z = compact ? SIZES.compact : SIZES.wide;
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const packetRef = React.useRef<SVGGElement>(null);
  const fillRef = React.useRef<SVGLineElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
          ([{ gsap }, { ScrollTrigger }]) => {
            const packet = packetRef.current;
            const fill = fillRef.current;
            if (cancelled || !packet || !fill) return;
            gsap.registerPlugin(ScrollTrigger);

            const ctx = gsap.context(() => {
              const tl = gsap.timeline({
                defaults: { ease: 'power1.inOut', duration: 1 },
                scrollTrigger: {
                  trigger: wrap,
                  // navbar balandligi (h-16) — sahna shu yerda yopishadi
                  start: 'top top+=64',
                  end: 'bottom bottom',
                  scrub: 0.8,
                },
              });

              // tugundan tugunga: tugun i ga yetib kelish vaqti = 2i
              for (let i = 0; i < X.length - 1; i++) {
                tl.to(packet, { x: X[i + 1]! - X[0]! }, 2 * i + 1);
                tl.to(fill, { attr: { x2: X[i + 1]! } }, 2 * i + 1);
              }
              // javob xuddi shu yo'l bilan qaytadi
              tl.to(packet, { x: 0 }, 9);
              // oxirgi birlik — kuzatuv qadami
              tl.to({}, {}, JOURNEY_TOTAL - 1);

              tl.eventCallback('onUpdate', () =>
                setActive(journeyStepAt(tl.time()))
              );
            }, wrap);
            revert = () => ctx.revert();
          }
        );
      },
      // bo'limdan bir ekran oldin yuklaymiz — yetib kelguncha tayyor bo'lsin
      { rootMargin: '100% 0px' }
    );
    io.observe(wrap);

    return () => {
      cancelled = true;
      io.disconnect();
      revert?.();
    };
  }, []);

  const step = JOURNEY_STEPS[active]!;

  return (
    <section id="packet" className="scroll-mt-20 pb-10 pt-20 sm:pt-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>
      </div>

      {/* Scroll uchun joy: sahna shu blok ichida yopishib turadi */}
      <div
        ref={wrapRef}
        className="relative h-[340vh] lg:h-[420vh] motion-reduce:h-auto motion-reduce:lg:h-auto"
      >
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center motion-reduce:static motion-reduce:h-auto motion-reduce:py-12">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-2xl border border-border bg-card px-2 py-3 shadow-sm sm:px-5 sm:py-5">
                <svg
                  viewBox="0 0 1000 250"
                  role="img"
                  aria-label={t('alt')}
                  className="block h-auto w-full"
                >
                  {/* Guruhlar: ofis va data-markaz */}
                  <text
                    x={(X[0]! + X[2]!) / 2}
                    y={z.capY}
                    textAnchor="middle"
                    fontSize={z.cap}
                    letterSpacing={z.capTrack}
                    className="fill-muted-foreground font-mono"
                  >
                    {t('office')}
                  </text>
                  <path d={`M ${X[0]! - R} ${z.lineY} H ${X[2]! + R}`} className="stroke-border" strokeWidth={1.2} />
                  <text
                    x={(X[3]! + X[4]!) / 2}
                    y={z.capY}
                    textAnchor="middle"
                    fontSize={z.cap}
                    letterSpacing={z.capTrack}
                    className="fill-muted-foreground font-mono"
                  >
                    {t('datacenter')}
                  </text>
                  <path d={`M ${X[3]! - R} ${z.lineY} H ${X[4]! + R}`} className="stroke-border" strokeWidth={1.2} />

                  {/* Yo'l: ofis ichi va data-markaz ichi — uzluksiz, internet — punktir */}
                  <path
                    d={`M ${X[0]} ${Y} H ${X[2]! + R} M ${X[3]! - R} ${Y} H ${X[4]}`}
                    className="stroke-border"
                    strokeWidth={2}
                  />
                  <path
                    d={`M ${X[2]! + R} ${Y} H ${X[3]! - R}`}
                    className="stroke-border"
                    strokeWidth={2}
                    strokeDasharray="6 8"
                  />
                  {compact ? null : (
                    <text
                      x={(X[2]! + X[3]!) / 2}
                      y={Y - 14}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono text-[12px] tracking-[0.2em]"
                    >
                      {t('internet')}
                    </text>
                  )}

                  {/* Bosib o'tilgan yo'l */}
                  <line
                    ref={fillRef}
                    x1={X[0]}
                    y1={Y}
                    x2={X[0]}
                    y2={Y}
                    className="stroke-accent motion-reduce:hidden"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />

                  {/* Paket. Tugunlardan OLDIN chiziladi: qurilmada turganida
                      tugun uni yopadi — "paket qurilma ichida" degan ma'no */}
                  <g transform={`translate(${X[0]} ${Y})`} className="motion-reduce:hidden">
                    <g ref={packetRef}>
                      <circle r={20} className="fill-accent/15" />
                      <circle r={8} className="fill-accent" />
                      <g transform={`translate(0 ${-R - z.tagDy}) scale(${z.tagScale})`}>
                        <rect x={-42} y={-13} width={84} height={26} rx={13} className="fill-card stroke-accent" strokeWidth={1.4} />
                        <text y={5} textAnchor="middle" className="fill-accent font-mono text-[13px] font-semibold">
                          {step.tag}
                        </text>
                      </g>
                    </g>
                  </g>

                  {/* Qurilmalar */}
                  {JOURNEY_NODES.map((node, i) => {
                    const on = active === LAST || step.node === i;
                    const done = !on && step.node !== null && i < step.node;
                    return (
                      <g key={node.id}>
                        <circle cx={X[i]} cy={Y} r={R} className="fill-card" />
                        <circle
                          cx={X[i]}
                          cy={Y}
                          r={R}
                          strokeWidth={1.6}
                          className={cn(
                            'transition-colors duration-300',
                            on
                              ? 'fill-accent/10 stroke-accent'
                              : done
                                ? 'fill-transparent stroke-accent/50'
                                : 'fill-transparent stroke-border',
                            'motion-reduce:stroke-accent'
                          )}
                        />
                        <g
                          transform={`translate(${X[i]} ${Y}) scale(1.15) translate(-12 -12)`}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            'fill-none transition-colors duration-300',
                            on || done ? 'stroke-accent' : 'stroke-tech-clay',
                            'motion-reduce:stroke-accent'
                          )}
                          dangerouslySetInnerHTML={{ __html: node.icon }}
                        />
                        <text
                          x={X[i]}
                          y={Y + R + z.labelDy}
                          textAnchor="middle"
                          fontSize={z.label}
                          letterSpacing={z.labelTrack}
                          className={cn(
                            'font-mono transition-colors duration-300',
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

              {/* Qadamlar. Animatsiyada bittasi ko'rinadi, reduced-motion'da —
                  hammasi ro'yxat bo'lib. `invisible` fokusni ham yashiradi:
                  ko'rinmas kartadagi havolaga Tab bilan tushib qolinmaydi. */}
              <ol
                aria-live="polite"
                className="relative mt-4 min-h-[13rem] sm:min-h-[9.5rem] motion-reduce:min-h-0 motion-reduce:space-y-3"
              >
                {JOURNEY_STEPS.map((s, i) => {
                  const detail = COURSE_DETAILS[s.course];
                  const moduleIndex =
                    detail && s.module
                      ? detail.modules.findIndex((m) => m.key === s.module) + 1
                      : 0;
                  const name = tc(`items.${s.course}.name`);
                  return (
                    <li
                      key={s.id}
                      className={cn(
                        'absolute inset-x-0 top-0 rounded-2xl border border-border bg-card px-5 py-4 transition-[opacity,visibility,transform] duration-300',
                        i === active
                          ? 'visible translate-y-0 opacity-100'
                          : 'invisible translate-y-1 opacity-0',
                        'motion-reduce:visible motion-reduce:static motion-reduce:translate-y-0 motion-reduce:opacity-100'
                      )}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-accent">
                          {pad(i + 1)} / {pad(JOURNEY_STEPS.length)}
                        </span>
                        <h3 className="font-bold tracking-tight">
                          {t(`steps.${s.id}.title`)}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {t(`steps.${s.id}.text`)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        <span className="text-muted-foreground">{t('learnLabel')}:</span>
                        {detail ? (
                          <Link
                            href={{
                              pathname: '/courses/[slug]',
                              params: { slug: detail.slug },
                            }}
                            onClick={() =>
                              track('course_open', {
                                course: s.course,
                                source: 'packet_journey',
                              })
                            }
                            className="group inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-accent"
                          >
                            {name}
                            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        ) : (
                          <span className="font-semibold">{name}</span>
                        )}
                        {moduleIndex > 0 && s.module ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            · {t('moduleN', { n: moduleIndex })} — {td(`${s.course}.modules.${s.module}`)}
                          </span>
                        ) : null}
                        {!detail ? (
                          <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                            {tc('soon')}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <p
                aria-hidden
                className={cn(
                  'mt-4 text-center font-mono text-xs text-muted-foreground transition-opacity duration-300',
                  active === 0 ? 'opacity-100' : 'opacity-0',
                  'motion-reduce:hidden'
                )}
              >
                ↓ {t('scrollHint')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

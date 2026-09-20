'use client';

import { useTranslations } from 'next-intl';

/* =========================================================================
 * TechMarquee — o'rgatiladigan texnologiyalar lentasi (cheksiz marquee).
 * Sof CSS animatsiya; reduced-motion'da to'xtaydi (globals.css qoidasi).
 * ========================================================================= */

const TECHS = [
  'Cisco',
  'MikroTik',
  'Linux',
  'Ubuntu',
  'Docker',
  'Asterisk',
  'FreePBX',
  'SIP / VoIP',
  'IP CCTV',
  'DVR / NVR',
  'Arduino',
  'Raspberry Pi',
  'TCP/IP',
  'VLAN / VPN',
  'MS Office',
];

export function TechMarquee() {
  const t = useTranslations('Marquee');

  return (
    <section
      aria-label={t('label')}
      className="relative border-y border-border/60 bg-secondary/20 py-5"
    >
      {/* Chekka soyalar — lenta chetlari silliq yo'qoladi */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />

      <div className="flex overflow-hidden">
        {/* Ikki nusxa — uzluksiz aylanish uchun */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 animate-marquee items-center"
          >
            {TECHS.map((tech) => (
              <li
                key={tech}
                className="mx-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-card/60 px-4 py-1.5 font-mono text-sm text-muted-foreground"
              >
                <span aria-hidden className="size-1.5 rounded-full bg-accent/70" />
                {tech}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

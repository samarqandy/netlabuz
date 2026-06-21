import { ImageResponse } from 'next/og';

import { routing } from '@/i18n/routing';

// OG rasm metadata (Next.js fayl-konvensiyasi: og:image avtomatik ulanadi)
export const alt = 'NETLAB — IT ta\'lim markazi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TAGLINES: Record<string, string> = {
  uz: "IT ta'lim markazi · Samarqand",
  ru: 'IT учебный центр · Самарканд',
  en: 'IT training center · Samarkand',
};

export default function OgImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const tagline = TAGLINES[locale] ?? TAGLINES.uz;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #0a1422 55%, #06243b 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#00D4FF',
          }}
        >
          <div style={{ width: 48, height: 4, background: '#00D4FF' }} />
          netlab.uz
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            fontSize: 168,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 28,
          }}
        >
          <span style={{ color: '#0088FF' }}>NET</span>
          <span style={{ color: '#ffffff' }}>LAB</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 500,
            marginTop: 24,
            color: '#94a3b8',
          }}
        >
          {tagline}
        </div>

        {/* Tech pills */}
        <div style={{ display: 'flex', gap: 18, marginTop: 56 }}>
          {['Cisco', 'Linux', 'IoT', 'CCTV', 'Network'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                fontSize: 30,
                fontWeight: 600,
                padding: '12px 28px',
                borderRadius: 999,
                color: '#00FF88',
                border: '2px solid rgba(0, 255, 136, 0.4)',
                background: 'rgba(0, 255, 136, 0.08)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

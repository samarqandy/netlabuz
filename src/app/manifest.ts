import type { MetadataRoute } from 'next';

// PWA manifest — "ekranga qo'shish" va brauzer integratsiyasi uchun
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NETLAB — Samarqand IT O‘quv Markazi',
    short_name: 'NETLAB',
    description:
      "Cisco, Linux, IoT va CCTV bo'yicha 100% amaliy IT kurslar — Samarqandda.",
    start_url: '/uz',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

import type { MetadataRoute } from 'next';

// PWA manifest — "ekranga qo'shish" va brauzer integratsiyasi uchun
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NETLAB — Samarqand IT O‘quv Markazi',
    short_name: 'NETLAB',
    description:
      "Cisco, Linux, IoT va CCTV bo'yicha 100% amaliy IT kurslar — Samarqandda.",
    // '/' — middleware foydalanuvchining tanlagan tiliga (NEXT_LOCALE)
    // yo'naltiradi; qattiq '/uz' til tanlovini bekor qilardi
    start_url: '/',
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
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

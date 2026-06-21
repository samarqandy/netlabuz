import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProd = process.env.NODE_ENV === 'production';

/** Security + performance headers (barcha yo'llarga qo'llanadi) */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()',
  },
  // DNS oldindan-yechish (tashqi havolalar tezroq ochiladi)
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // HSTS — 2 yil, subdomenlar bilan (preload qo'shilmadi: qaytarish qiyin)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: 'netlab.uz' },
    ],
  },
  compiler: {
    // Production'da console.log/debug o'chiriladi, console.error SAQLANADI
    // (Vercel function loglari, masalan api/send xatolari uchun)
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },
  experimental: {
    // Yirik kutubxonalardan faqat ishlatilgan moduln import qilinadi (tree-shaking)
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://netlab.uz';

/**
 * robots.txt — Next.js App Router konvensiyasi (/robots.txt).
 * Hammaga ruxsat + sitemap'ga ishora.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

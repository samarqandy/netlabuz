/* =========================================================================
 * NETLAB tashkilot ma'lumotlari — yagona manba (NAP: Name/Address/Phone).
 * JSON-LD, navbar, footer, contact — hammasi shu yerdan oladi.
 * Manzil/telefon o'zgarsa FAQAT shu faylni yangilang.
 * ========================================================================= */

export const ORG = {
  name: 'NETLAB',
  url: 'https://netlab.uz',
  phone: '+998936803113',
  telegram: 'https://t.me/netlabuz',
  telegramHandle: '@netlabuz',
  telegramChannels: [
    { label: '@netlabuz', href: 'https://t.me/netlabuz' },
    { label: '@netlab_sam', href: 'https://t.me/netlab_sam' },
  ],
  mapUrl: 'https://maps.google.com/?q=Dahbed+11,+Samarkand,+Uzbekistan',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dahbed 11',
    addressLocality: 'Samarqand',
    addressCountry: 'UZ',
  },
} as const;

/**
 * JSON-LD ni <script> ichiga xavfsiz joylash uchun serializatsiya:
 * '<' ni < ga almashtiradi — tarjima matnida '</script>' bo'lsa ham
 * script elementi buzilmaydi (XSS oldini oladi).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

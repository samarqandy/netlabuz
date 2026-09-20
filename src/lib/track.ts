import { track as vercelTrack } from '@vercel/analytics';

/* =========================================================================
 * Konversiya hodisalari — Vercel Analytics custom events.
 * Nomlar barqaror bo'lsin: dashboard'da tarix uzilmasligi uchun
 * mavjud hodisa nomini o'zgartirmang, faqat yangisini qo'shing.
 *
 *  cta_click       { location }          — asosiy CTA tugmalari
 *  telegram_click  { location }          — Telegram havolalari
 *  course_select   { course, source }    — kurs tanlash (karta yoki test)
 *  quiz_completed  { result }            — test yakunlandi
 *  lead_submitted  { course }            — forma muvaffaqiyatli yuborildi
 * ========================================================================= */

type Props = Record<string, string>;

/** Analytics xatosi UX'ni hech qachon buzmasligi kerak */
export function track(event: string, props?: Props) {
  try {
    vercelTrack(event, props);
  } catch {
    // jim — analytics yo'qligida (masalan, lokal) hech narsa qilmaymiz
  }
}

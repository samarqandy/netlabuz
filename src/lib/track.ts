import { track as vercelTrack } from '@vercel/analytics';

/* =========================================================================
 * Konversiya hodisalari — Vercel Analytics, GA4 va Yandex Metrica.
 * Nomlar barqaror bo'lsin: dashboard'da tarix uzilmasligi uchun
 * mavjud hodisa nomini o'zgartirmang, faqat yangisini qo'shing.
 *
 *  cta_click       { location }          — asosiy CTA tugmalari
 *  telegram_click  { location }          — Telegram havolalari
 *  course_select   { course, source }    — kurs tanlash (karta yoki test)
 *  quiz_completed  { result }            — test yakunlandi
 *  lead_submitted  { course }            — forma muvaffaqiyatli yuborildi
 *
 * GA4 ga hodisa shu nom bilan, Metrica'ga reachGoal(nom) sifatida ketadi.
 * Ism, telefon yoki xabar matni hech qachon yuborilmaydi — faqat yuqoridagi
 * maydonlar.
 * ========================================================================= */

// Vercel Analytics qabul qiladigan qiymat turlari bilan mos
type Props = Record<string, string | number | boolean | null>;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  ym?: (...args: unknown[]) => void;
  __ymId?: number;
};

/** Analytics xatosi UX'ni hech qachon buzmasligi kerak */
export function track(event: string, props?: Props) {
  try {
    vercelTrack(event, props);
  } catch {
    // jim — analytics yo'qligida (masalan, lokal) hech narsa qilmaymiz
  }
  if (typeof window === 'undefined') return;
  const w = window as AnalyticsWindow;
  try {
    w.gtag?.('event', event, props ?? {});
  } catch {
    // jim
  }
  try {
    if (w.ym && w.__ymId) w.ym(w.__ymId, 'reachGoal', event, props ?? {});
  } catch {
    // jim
  }
}

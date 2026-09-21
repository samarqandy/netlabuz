/* =========================================================================
 * Narx bilan ishlash.
 *
 * Narxlarning o'zi `src/lib/courses.ts` dagi `priceFrom` maydonida — OYLIK,
 * so'mda. Kiritilmagan kursda narx saytda umuman ko'rsatilmaydi (taxminiy
 * raqam yozilmaydi).
 *
 * ⚠️ Raqam ataylab `Intl.NumberFormat` bilan formatlanmaydi: brauzerlarning
 * bir qismida 'uz' lokali ICU'da yo'q va "980 000" o'rniga "980,000" chiqadi
 * — server bilan mos kelmay hydration xatosi beradi. Shuning uchun uch xonali
 * guruhlar qo'lda, uzilmaydigan probel (U+00A0) bilan ajratiladi: natija
 * serverda ham, brauzerda ham bir xil.
 * ========================================================================= */

/** ISO 4217 — schema.org Offer uchun */
export const PRICE_CURRENCY = 'UZS';

/** 980000 → "980 000" (uzilmaydigan probel bilan) */
export function formatPrice(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

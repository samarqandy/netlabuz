/* =========================================================================
 * Google Analytics 4 va Yandex Metrica identifikatorlari.
 * Ikkalasi ham ochiq (brauzerda ko'rinadi). NEXT_PUBLIC_* muhit o'zgaruvchisi
 * berilsa, u ustun turadi; noto'g'ri ko'rinishdagi qiymat skriptga tushmaydi.
 * ========================================================================= */

const GA_DEFAULT = 'G-8GKNRDFNSZ';
const YM_DEFAULT = '114112413';

/** Yandex Webmaster egalik kodi (<meta name="yandex-verification">) */
export const YANDEX_VERIFICATION = 'e697aae8480c2a59';

export function gaId(value = process.env.NEXT_PUBLIC_GA_ID): string {
  const id = (value ?? '').trim() || GA_DEFAULT;
  return /^G-[A-Z0-9]{4,}$/.test(id) ? id : '';
}

export function ymId(value = process.env.NEXT_PUBLIC_YM_ID): string {
  const id = (value ?? '').trim() || YM_DEFAULT;
  return /^\d{6,10}$/.test(id) ? id : '';
}

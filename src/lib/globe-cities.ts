/* =========================================================================
 * Kiber-globus uchun shahar tugunlari.
 *
 * Koordinatalar — oddiy geografik ma'lumot (lat/lon, daraja). "Uy" tuguni
 * Samarqand: barcha yo'nalishlar shu yerga keladi, chunki NETLAB shu yerda.
 *
 * ⚠️ Bu yerdagi hech narsa real hujum statistikasi emas va saytda statistika
 * sifatida ko'rsatilmaydi — bu faqat vizual, "dunyo xaritasi" effekti.
 * Shuning uchun ekranda hech qanday raqam (hujum soni va h.k.) chizilmaydi.
 * ========================================================================= */

export interface GlobeCity {
  /** Ekranda chiziladigan yorliq (faqat uy tuguni uchun) */
  name: string;
  lat: number;
  lon: number;
  /** Uy tuguni — yo'nalishlarning yakuniy nuqtasi */
  home?: boolean;
}

export const GLOBE_CITIES: GlobeCity[] = [
  { name: 'SAMARQAND', lat: 39.65, lon: 66.96, home: true },
  { name: 'Toshkent', lat: 41.31, lon: 69.24 },
  { name: 'Almaty', lat: 43.24, lon: 76.89 },
  { name: 'Moskva', lat: 55.75, lon: 37.62 },
  { name: 'Istanbul', lat: 41.01, lon: 28.98 },
  { name: 'Frankfurt', lat: 50.11, lon: 8.68 },
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'Amsterdam', lat: 52.37, lon: 4.9 },
  { name: 'Nyu-York', lat: 40.71, lon: -74.01 },
  { name: 'Los-Anjeles', lat: 34.05, lon: -118.24 },
  { name: 'San-Paulu', lat: -23.55, lon: -46.63 },
  { name: 'Dubay', lat: 25.2, lon: 55.27 },
  { name: 'Mumbay', lat: 19.08, lon: 72.88 },
  { name: 'Singapur', lat: 1.35, lon: 103.82 },
  { name: 'Pekin', lat: 39.9, lon: 116.41 },
  { name: 'Seul', lat: 37.57, lon: 126.98 },
  { name: 'Tokio', lat: 35.68, lon: 139.69 },
  { name: 'Lagos', lat: 6.52, lon: 3.38 },
  { name: 'Yohannesburg', lat: -26.2, lon: 28.05 },
  { name: 'Sidney', lat: -33.87, lon: 151.21 },
];

export const HOME_INDEX = GLOBE_CITIES.findIndex((c) => c.home);

/**
 * Natural Earth 110m "land" ma'lumotidan quruqlik maskasini yasaydi.
 *
 * Fibonacci sferasidagi N nuqtani ko'rib chiqadi va har biri quruqlikka
 * tushadimi-yo'qmi degan bitta bitni yozadi. Natija — base64 satr, ya'ni
 * ~N/8 bayt. Runtime'da sfera yana shu tartibda yasaladi va faqat biti
 * yoqilgan nuqtalar chiziladi: hech qanday geo-kutubxona kerak emas.
 *
 * Qayta yurgizish:  node scripts/gen-land-mask.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';

const N = 26000;
const topo = JSON.parse(
  readFileSync('node_modules/world-atlas/land-110m.json', 'utf8')
);
const land = feature(topo, topo.objects.land);

const bytes = new Uint8Array(Math.ceil(N / 8));
const golden = Math.PI * (3 - Math.sqrt(5));
let hits = 0;

for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2; // 1 .. -1
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * i;
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;

  // sfera koordinatasi → lat/lon (y = qutb o'qi)
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = (Math.atan2(z, x) * 180) / Math.PI;

  if (geoContains(land, [lon, lat])) {
    bytes[i >> 3] |= 1 << (i & 7);
    hits++;
  }
}

const b64 = Buffer.from(bytes).toString('base64');
const out = `/* eslint-disable */
/* =========================================================================
 * AVTOMATIK YARATILGAN FAYL — qo'lda tahrirlamang.
 * Manba: Natural Earth 110m land (world-atlas), skript:
 *   node scripts/gen-land-mask.mjs
 *
 * ${N} ta Fibonacci nuqtasidan ${hits} tasi quruqlikka tushadi.
 * Har bit — bitta nuqta; base64 ${b64.length} belgi (~${Math.round(bytes.length / 1024 * 10) / 10} KB).
 * ========================================================================= */

/** Maskadagi nuqtalar soni (sfera shu qadar nuqta bilan yasalishi shart) */
export const LAND_SAMPLES = ${N};

/** Quruqlikdagi nuqtalar soni */
export const LAND_POINTS = ${hits};

export const LAND_MASK_B64 =
  '${b64}';
`;
writeFileSync('src/lib/land-mask.ts', out);
console.log(`N=${N} land=${hits} (${((hits / N) * 100).toFixed(1)}%) base64=${b64.length} chars`);

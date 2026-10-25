'use client';

import * as React from 'react';

import { GLOBE_CITIES, HOME_INDEX } from '@/lib/globe-cities';
import { LAND_MASK_B64, LAND_SAMPLES } from '@/lib/land-mask';

/* =========================================================================
 * Kiber-globus — "hujum xaritasi" uslubidagi aylanuvchi yer shari.
 *
 * Nega shunday ko'rinadi: Kaspersky Cybermap, Check Point ThreatCloud,
 * Radware Live Threat Map, NETSCOUT Cyber Threat Horizon — bu janrdagi
 * barcha jonli xaritalarda bir xil uch qatlam bor:
 *   1) qorong'u, nuqtalardan yasalgan quruqlik (holografik, "ma'lumot" hissi);
 *   2) manbadan nishonga uchuvchi yorug' yoy (great-circle, dumi bilan);
 *   3) nishonda zarba pulsi.
 * Shu uchligi uni bezakdan "monitoring ekrani"ga aylantiradi.
 *
 * Bizdagi farq: nishon doim Samarqand — ya'ni markazning o'zi. Yoylar
 * dunyoning turli nuqtalaridan shu yerga keladi va yashil pulsda "to'xtaydi".
 *
 * ⚠️ Hech qanday raqam yoki statistika chizilmaydi: ma'lumot real emas,
 * demak ekranda son bo'lishi ham mumkin emas. Faqat vizual.
 *
 * Quruqlik ma'lumoti: Natural Earth 110m, `src/lib/land-mask.ts` ichida
 * bit-maska sifatida (2 KB). Runtime'da geo-kutubxona kerak emas.
 *
 * Perf: Canvas 2D, 30 FPS cheklovi, DPR 1.5 gacha, ko'rinmaganda va tab
 * yashiringanda pauza, reduced-motion'da bitta statik kadr.
 * ========================================================================= */

const FPS = 30;
/* Globus to'liq aylanmaydi, balki sekin tebranadi.
 *
 * Nega: nishon — Samarqand. To'liq aylanishda u vaqtning yarmida sharning
 * orqasida qolardi va o'sha paytda ekranda hech narsa sodir bo'lmasdi.
 * Tebranishda u doim ko'rinadi, harakat esa shuncha sekinki (eng tez
 * nuqtada ~0,04 rad/s) u animatsiya emas, muhit bo'lib o'qiladi. */
const SWING = 0.3; // radian (±17°)
const SWING_MS = 46000; // to'liq tebranish davri
/** Qaysi kenglikdan qaralayotgani (daraja). Samarqand 39.6°N — biroz
 *  pastdan qarasak, u markazdan sal yuqorida turadi va Yevrosiyo to'liq
 *  ko'rinadi. */
const VIEW_LAT = 32;
const TILT = (-VIEW_LAT * Math.PI) / 180;
/** Quruqlik nuqtalari chuqurlik bo'yicha shuncha guruhga bo'linadi */
const TIERS = 4;
/** Perspektiva kuchi */
const PERSP = 0.3;
/** Bitta yoyning uchish vaqti */
const ARC_MS = 2200;
/** Yoy dumining uzunligi (yo'lning ulushi) */
const TRAIL = 0.42;
/** Bir vaqtda ko'pi bilan nechta yoy */
const MAX_ARCS = 4;
/** Yangi yoylar orasidagi tanaffus */
const GAP_MIN = 420;
const GAP_MAX = 1400;
/** Nishondagi pulsning yashash vaqti */
const PULSE_MS = 900;

/** Hujum yoyi rangi — tailwind.config.ts dagi `tech.clay` (#D97757).
 *  Mavzuga bog'liq emas: ikkala mavzuda ham "ogohlantirish" bo'lib o'qiladi. */
const CLAY = '217, 119, 87';

interface Arc {
  /** Manba shahar indeksi */
  from: number;
  /** Boshlangan vaqt */
  start: number;
  /** Yo'l nuqtalari (birlik vektorlar, ko'tarilgan) */
  path: Float32Array;
}

interface Pulse {
  start: number;
}

/** lat/lon (daraja) → birlik sfera vektori. y — qutb o'qi. */
function toXyz(lat: number, lon: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  const r = Math.cos(la);
  return [r * Math.cos(lo), Math.sin(la), r * Math.sin(lo)];
}

/** Bit-maskadan quruqlik nuqtalarini tiklaydi (modul darajasida bir marta) */
let landCache: Float32Array | null = null;
function landPoints(): Float32Array {
  if (landCache) return landCache;
  const bin = atob(LAND_MASK_B64);
  const out: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < LAND_SAMPLES; i++) {
    // maska skriptdagi bilan bir xil tartibda o'qiladi
    if (!(bin.charCodeAt(i >> 3) & (1 << (i & 7)))) continue;
    const y = 1 - (i / (LAND_SAMPLES - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    out.push(Math.cos(th) * r, y, Math.sin(th) * r);
  }
  landCache = new Float32Array(out);
  return landCache;
}

/**
 * Great-circle yo'li: ikki nuqta orasidagi eng qisqa yo'l, o'rtasi sfera
 * ustidan ko'tariladi. Uzoq masofaga baland yoy — shuning uchun ko'tarilish
 * burchakka proporsional.
 */
function arcPath(
  a: [number, number, number],
  b: [number, number, number],
  steps = 40
): Float32Array {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const lift = 0.1 + 0.26 * (omega / Math.PI);
  const out = new Float32Array(steps * 3);
  const sinO = Math.sin(omega);
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    let x: number;
    let y: number;
    let z: number;
    if (sinO < 1e-6) {
      x = a[0];
      y = a[1];
      z = a[2];
    } else {
      const k1 = Math.sin((1 - t) * omega) / sinO;
      const k2 = Math.sin(t * omega) / sinO;
      x = a[0] * k1 + b[0] * k2;
      y = a[1] * k1 + b[1] * k2;
      z = a[2] * k1 + b[2] * k2;
    }
    const len = Math.hypot(x, y, z) || 1;
    const h = 1 + lift * Math.sin(Math.PI * t);
    out[i * 3] = (x / len) * h;
    out[i * 3 + 1] = (y / len) * h;
    out[i * 3 + 2] = (z / len) * h;
  }
  return out;
}

/** `--accent` kabi HSL uchligini `hsl(... / a)` ga aylantiradi */
function hsl(varName: string, alpha: number, fallback: string) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return raw ? `hsl(${raw} / ${alpha})` : fallback;
}

export function CyberGlobe({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const land = landPoints();
    const cities = GLOBE_CITIES.map((c) => toXyz(c.lat, c.lon));
    const home = cities[HOME_INDEX]!;
    const homeName = GLOBE_CITIES[HOME_INDEX]!.name;
    // Yo'llar oldindan hisoblanadi: kadr ichida faqat proyeksiya qoladi
    const paths = cities.map((c, i) => (i === HOME_INDEX ? null : arcPath(c, home)));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let colors = { land: '', rim: '', accent: '', text: '', body: '' };
    const readColors = () => {
      colors = {
        land: hsl('--muted-foreground', 0.85, 'rgba(255,255,255,0.7)'),
        rim: hsl('--primary', 0.3, 'rgba(0,120,255,0.3)'),
        accent: hsl('--accent', 1, 'rgb(0,255,136)'),
        text: hsl('--muted-foreground', 0.9, 'rgba(255,255,255,0.8)'),
        // Shar tanasi: oq fonda to'q ko'k dog' bo'lib qolmasligi uchun
        // mavzu rangidan olinadi (bir paytlar qotib qolgan to'q ko'k edi —
        // yorug' mavzuda globus kulrang to'pga o'xshab qolgandi).
        body: hsl('--primary', 0.13, 'rgba(0,80,160,0.13)'),
      };
    };
    readColors();
    let gradientStale = true;
    const themeWatch = new MutationObserver(() => {
      readColors();
      gradientStale = true;
    });
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Chuqurlik pog'onalari uchun oldindan ajratilgan buferlar
    const tiers = Array.from(
      { length: TIERS },
      () => new Float32Array((land.length / 3) * 2)
    );
    const tierCount = new Int32Array(TIERS);

    let w = 0;
    let h = 0;
    let body: CanvasGradient | null = null;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gradientStale = true;
    };
    resize();
    // reduced-motion'da kadr halqasi yo'q: o'lcham o'zgarganda canvas tozalanib
    // bo'sh qolmasligi uchun shu yerda qayta chiziladi.
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    // Samarqand kadr oldiga kelib turishi uchun boshlang'ich burilish.
    // -atan2 uni o'ng chetga olib keladi, -PI/2 esa markazga buradi.
    const rotBase = -Math.atan2(home[2], home[0]) - Math.PI / 2;
    let rot = rotBase;
    const arcs: Arc[] = [];
    const pulses: Pulse[] = [];
    let nextArc = 0;

    const project = (
      x: number,
      y: number,
      z: number,
      cos: number,
      sin: number,
      cosT: number,
      sinT: number,
      cx: number,
      cy: number,
      R: number
    ) => {
      const x1 = x * cos - z * sin;
      const z1 = x * sin + z * cos;
      const y2 = y * cosT - z1 * sinT;
      const z2 = y * sinT + z1 * cosT;
      const k = 1 / (1 + z2 * PERSP);
      // ekranda y pastga o'sadi, shimol tepada bo'lishi uchun minus
      return { sx: cx + x1 * R * k, sy: cy - y2 * R * k, d: z2 };
    };

    const draw = (now: number) => {
      if (!w || !h) return;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) / 2 - 2;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);

      ctx.clearRect(0, 0, w, h);

      // 1. Shar tanasi — chuqurlik hissi uchun (blur emas, gradient)
      if (gradientStale) {
        body = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
        body.addColorStop(0, colors.body);
        body.addColorStop(1, 'transparent');
        gradientStale = false;
      }
      if (body) {
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Quruqlik nuqtalari.
      //
      // Orqa yarim shar umuman chizilmaydi: shaffof globusda qit'alar
      // bir-birining ustiga tushib, shakli o'qilmay qoladi (shu xatoni
      // bir marta qilib ko'rdik). Chuqurlik bo'yicha 4 pog'ona —
      // chetga yaqini xiraroq, shunda chekka o'zi yumshoq tugaydi.
      //
      // Har pog'ona bitta `fill()` bilan chiziladi: 7,5 ming nuqtaga
      // alohida `fillRect` qilish kadr vaqtini bekorga yeydi.
      // Proyeksiya shu yerda qo'lda yozilgan: `project()` har chaqiriqda
      // yangi obyekt qaytaradi, 7,5 ming nuqtaga ko'paytirilsa bu kadriga
      // 7,5 ming ortiqcha obyekt — axlat yig'uvchi bekorga ishlaydi.
      tierCount.fill(0);
      for (let i = 0; i < land.length; i += 3) {
        const x = land[i]!;
        const y = land[i + 1]!;
        const z = land[i + 2]!;
        const z1 = x * sin + z * cos;
        const d = y * sinT + z1 * cosT;
        const front = (1 - d) / 2; // 0 orqa … 1 old
        if (front < 0.5) continue;
        const k2 = 1 / (1 + d * PERSP);
        const tier = Math.min(TIERS - 1, ((front - 0.5) * 2 * TIERS) | 0);
        const buf = tiers[tier]!;
        const k = tierCount[tier]! * 2;
        buf[k] = cx + (x * cos - z * sin) * R * k2;
        buf[k + 1] = cy - (y * cosT - z1 * sinT) * R * k2;
        tierCount[tier]!++;
      }
      ctx.fillStyle = colors.land;
      for (let t = 0; t < TIERS; t++) {
        const n = tierCount[t]!;
        if (!n) continue;
        const buf = tiers[t]!;
        const s = t >= 2 ? 1.8 : 1.3;
        ctx.globalAlpha = 0.3 + (t / (TIERS - 1)) * 0.7;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          ctx.rect(buf[i * 2]! - s / 2, buf[i * 2 + 1]! - s / 2, s, s);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 3. Chegara halqasi
      ctx.strokeStyle = colors.rim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Shahar tugunlari (uy tuguni alohida, pastda)
      for (let i = 0; i < cities.length; i++) {
        if (i === HOME_INDEX) continue;
        const c = cities[i]!;
        const p = project(c[0], c[1], c[2], cos, sin, cosT, sinT, cx, cy, R);
        const front = (1 - p.d) / 2;
        if (front < 0.56) continue;
        const live = arcs.some((a) => a.from === i);
        ctx.globalAlpha = Math.min(1, (front - 0.54) * 2.6) * (live ? 1 : 0.5);
        ctx.fillStyle = `rgba(${CLAY}, 1)`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, live ? 2.4 : 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (live) {
          ctx.strokeStyle = `rgba(${CLAY}, 0.45)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 5.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // 5. Hujum yoylari — dumi bilan
      for (const arc of arcs) {
        const t = Math.min(1, (now - arc.start) / ARC_MS);
        const steps = arc.path.length / 3;
        const head = t * (steps - 1);
        const tail = Math.max(0, head - TRAIL * (steps - 1));
        let prev: { sx: number; sy: number; d: number } | null = null;
        for (let i = Math.floor(tail); i <= Math.ceil(head) && i < steps; i++) {
          const p = project(
            arc.path[i * 3]!, arc.path[i * 3 + 1]!, arc.path[i * 3 + 2]!,
            cos, sin, cosT, sinT, cx, cy, R
          );
          if (prev) {
            // sharning orqasidagi bo'lak ko'rinmaydi
            const behind = p.d > 0.08 && Math.hypot(p.sx - cx, p.sy - cy) < R;
            const near = (i - tail) / Math.max(1, head - tail); // dum → bosh
            if (!behind) {
              ctx.globalAlpha = Math.max(0, Math.min(1, near)) ** 1.1;
              ctx.strokeStyle = `rgba(${CLAY}, 1)`;
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(prev.sx, prev.sy);
              ctx.lineTo(p.sx, p.sy);
              ctx.stroke();
            }
          }
          prev = p;
        }
        // yoyning boshi
        if (prev && !(prev.d > 0.08 && Math.hypot(prev.sx - cx, prev.sy - cy) < R)) {
          // yumshoq halo (blur emas — ikkinchi doira, bu deyarli bepul)
          ctx.globalAlpha = 0.28;
          ctx.fillStyle = `rgba(${CLAY}, 1)`;
          ctx.beginPath();
          ctx.arc(prev.sx, prev.sy, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(prev.sx, prev.sy, 2.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 6. Uy tuguni — Samarqand: pulslar, belgi, yorliq
      const hp = project(home[0], home[1], home[2], cos, sin, cosT, sinT, cx, cy, R);
      const homeFront = (1 - hp.d) / 2;
      if (homeFront > 0.5) {
        const vis = Math.min(1, (homeFront - 0.48) * 3);
        for (const pulse of pulses) {
          const t = (now - pulse.start) / PULSE_MS;
          if (t < 0 || t > 1) continue;
          ctx.globalAlpha = (1 - t) * 0.85 * vis;
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(hp.sx, hp.sy, 3 + t * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = vis;
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(hp.sx, hp.sy, 3.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = vis * 0.9;
        ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = colors.text;
        ctx.textBaseline = 'middle';
        // O'ngda joy qolmasa — chapga yoziladi (globus kadrdan chiqib
        // turadi, shuning uchun yorliq qirqilib qolishi mumkin edi)
        const fits = hp.sx + 9 + ctx.measureText(homeName).width < w;
        ctx.textAlign = fits ? 'left' : 'right';
        ctx.fillText(homeName, hp.sx + (fits ? 9 : -9), hp.sy);
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      // Statik kadr: bitta yoy yarim yo'lda to'xqib turadi
      const demo = paths[4];
      if (demo) arcs.push({ from: 4, start: -ARC_MS * 0.45, path: demo });
      draw(0);
      return () => {
        ro.disconnect();
        themeWatch.disconnect();
      };
    }

    let raf = 0;
    let last = 0;
    let visible = true;

    const spawn = (now: number) => {
      // Nishon kadrning orqasida bo'lsa, hujum ko'rinmaydi — kutamiz
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const z1 = home[0] * sin + home[2] * cos;
      const depth = home[1] * Math.sin(TILT) + z1 * Math.cos(TILT);
      if (depth > -0.15) return;
      if (arcs.length >= MAX_ARCS) return;

      const busy = new Set(arcs.map((a) => a.from));
      const options: number[] = [];
      for (let i = 0; i < cities.length; i++) {
        if (i === HOME_INDEX || busy.has(i)) continue;
        options.push(i);
      }
      // Ikki nomzoddan uzog'ini tanlaymiz: uzoq yoy globus bo'ylab
      // keng yoy chizadi va effekt kuchliroq ko'rinadi.
      const a = options[Math.floor(Math.random() * options.length)];
      const b2 = options[Math.floor(Math.random() * options.length)];
      if (a === undefined || b2 === undefined) return;
      const far = (i: number) => {
        const c = cities[i]!;
        return -(c[0] * home[0] + c[1] * home[1] + c[2] * home[2]);
      };
      const pick = far(a) >= far(b2) ? a : b2;
      const path = paths[pick];
      if (!path) return;
      arcs.push({ from: pick, start: now, path });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (now - last < 1000 / FPS) return;
      last = now;

      rot = rotBase + SWING * Math.sin((now / SWING_MS) * Math.PI * 2);

      if (now >= nextArc) {
        spawn(now);
        nextArc = now + GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      }
      // tugagan yoylar → nishonda puls
      for (let i = arcs.length - 1; i >= 0; i--) {
        if (now - arcs[i]!.start >= ARC_MS) {
          arcs.splice(i, 1);
          pulses.push({ start: now });
        }
      }
      while (pulses.length && now - pulses[0]!.start > PULSE_MS) pulses.shift();

      draw(now);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = !!e?.isIntersecting;
      },
      { rootMargin: '120px' }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeWatch.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

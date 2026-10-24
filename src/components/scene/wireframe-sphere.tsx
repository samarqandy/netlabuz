'use client';

import * as React from 'react';

/* =========================================================================
 * Simli sfera (wireframe sphere) — sekin aylanuvchi tarmoq globusi.
 *
 * GitLab'ning bosh sahifasidagi yechim o'lchab olindi: ularning sferasi
 * 0,7 soniyada 14 400 pikseldan atigi ~100 tasini o'zgartiradi — ya'ni
 * harakat shunchalik sekinki, u animatsiya emas, muhit bo'lib ko'rinadi.
 * Bizda ham xuddi shunday: ~0,06 rad/s.
 *
 * Nega Canvas 2D va WebGL emas: butun ish bir kadrda 150 nuqtani proyeksiya
 * qilish va ~300 chiziq chizishdan iborat. Bu shader'dan o'nlab barobar
 * arzon va kod ham o'nlab barobar qisqa.
 *
 * Perf: 24 FPS cheklovi, ko'rinmasa va tab yashiringanda pauza, DPR 1.5 gacha
 * (DPR 2 da bir marta kuygandik), reduced-motion'da bitta statik kadr.
 * ========================================================================= */

const POINTS = 150;
/** Har nuqta nechta eng yaqin qo'shnisi bilan bog'lanadi */
const NEIGHBOURS = 3;
const FPS = 24;
const SPEED = 0.0026; // radian / kadr → ~0.06 rad/s
const TILT = 0.42; // sferaning qiyaligi (radian)

interface Point {
  x: number;
  y: number;
  z: number;
}

/** Fibonacci sferasi — nuqtalar sirtga teng tarqaladi */
function sphere(n: number): Point[] {
  const pts: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

/** Har nuqtani eng yaqin k qo'shnisiga ulaydi (takrorlar olib tashlanadi) */
function edges(pts: Point[], k: number): [number, number][] {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!;
    const near = pts
      .map((b, j) => ({
        j,
        d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2,
      }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, k);
    for (const n of near) {
      const key = i < n.j ? `${i}-${n.j}` : `${n.j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([i, n.j]);
    }
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

export function WireframeSphere({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pts = sphere(POINTS);
    const links = edges(pts, NEIGHBOURS);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let colors = { line: '', dot: '', glow: '' };
    const readColors = () => {
      colors = {
        line: hsl('--muted-foreground', 0.52, 'rgba(255,255,255,0.45)'),
        dot: hsl('--muted-foreground', 0.8, 'rgba(255,255,255,0.7)'),
        glow: hsl('--accent', 0.85, 'rgba(0,255,136,0.85)'),
      };
    };
    readColors();
    // mavzu almashganda ranglar yangilanadi
    const themeWatch = new MutationObserver(readColors);
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rot = 0.6;
    const draw = () => {
      if (!w || !h) return;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) / 2 - 2;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);

      // proyeksiya
      const px: number[] = [];
      const py: number[] = [];
      const depth: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!;
        const x = p.x * cos - p.z * sin;
        const z0 = p.x * sin + p.z * cos;
        const y = p.y * cosT - z0 * sinT;
        const z = p.y * sinT + z0 * cosT;
        const k = 1 / (1 + z * 0.32); // perspektiva
        px.push(cx + x * R * k);
        py.push(cy + y * R * k);
        depth.push(z); // -1 old, +1 orqa
      }

      ctx.clearRect(0, 0, w, h);

      // chiziqlar — orqa tomoni xiraroq
      ctx.lineWidth = 1;
      for (const [a, b] of links) {
        const front = 1 - (depth[a]! + depth[b]!) / 2; // 0..2
        const alpha = Math.max(0, Math.min(1, front / 2)) ** 2;
        if (alpha < 0.04) continue;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = colors.line;
        ctx.beginPath();
        ctx.moveTo(px[a]!, py[a]!);
        ctx.lineTo(px[b]!, py[b]!);
        ctx.stroke();
      }

      // tugunlar — kvadratchalar, old tomondagilari yorqinroq
      for (let i = 0; i < pts.length; i++) {
        const front = (1 - depth[i]!) / 2; // 0..1
        if (front < 0.22) continue;
        ctx.globalAlpha = front ** 2;
        // har 11-tugun aksent rangda — "faol tugun"
        ctx.fillStyle = i % 11 === 0 ? colors.glow : colors.dot;
        const s = front > 0.8 ? 2.4 : 1.8;
        ctx.fillRect(px[i]! - s / 2, py[i]! - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      draw();
      return () => {
        ro.disconnect();
        themeWatch.disconnect();
      };
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (now - last < 1000 / FPS) return;
      last = now;
      rot += SPEED;
      draw();
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

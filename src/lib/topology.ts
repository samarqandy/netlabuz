/* =========================================================================
 * Hero'dan keyingi "jonli topologiya" bo'limi uchun ma'lumot.
 *
 * Har tugun — bitta kurs. Koordinatalar 800×290 viewBox ichida (SVG o'zi
 * konteynerga moslashadi). Ikonkalar 24×24 maydonda chizilgan va tugun
 * markaziga nisbatan joylashtiriladi.
 *
 * Yangi kurs qo'shsangiz: `courses.ts` ga yozuv → shu yerga tugun →
 * kerak bo'lsa yangi bog'lanish (LINKS).
 * ========================================================================= */

import type { CourseId } from './courses';

export interface TopologyNode {
  id: CourseId;
  /** Tugun ostidagi qisqa yorliq (til-neytral) */
  label: string;
  /** Markaz koordinatasi */
  x: number;
  y: number;
  /** Doira radiusi */
  r: number;
  /** 24×24 maydondagi ikonka (iliq, yumaloq uslub) */
  icon: string;
}

export interface TopologyLink {
  /** SVG path `d` */
  d: string;
  /** Chiziq uzunligi (stroke-dasharray animatsiyasi uchun, taxminiy) */
  len: number;
  /** Magistral chiziqmi — ustidan yorug' paket yuguradi */
  beam?: boolean;
}

export const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'computer',
    label: 'PC',
    x: 88,
    y: 150,
    r: 30,
    icon: '<rect x="3" y="4.5" width="18" height="12" rx="3.2"/><path d="M12 16.5v3.2M8.6 19.7h6.8"/>',
  },
  {
    id: 'cisco',
    label: 'SWITCH',
    x: 318,
    y: 150,
    r: 30,
    icon: '<rect x="2.6" y="9" width="18.8" height="8.4" rx="3"/><path d="M7.2 13.2h.01M12 13.2h.01M16.8 13.2h.01"/><path d="M8.4 9V6.2M15.6 9V6.2"/>',
  },
  {
    id: 'linux',
    label: 'SERVER',
    x: 548,
    y: 150,
    r: 30,
    icon: '<rect x="3" y="4" width="18" height="7" rx="2.6"/><rect x="3" y="13" width="18" height="7" rx="2.6"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  },
  {
    id: 'aicoding',
    label: 'AI',
    x: 792,
    y: 150,
    r: 30,
    icon: '<path d="M12 3.2c.75 4.6 2.45 6.3 7.05 7.05-4.6.75-6.3 2.45-7.05 7.05-.75-4.6-2.45-6.3-7.05-7.05C9.55 9.5 11.25 7.8 12 3.2Z"/><path d="M18.8 17.6h.01M6.1 19.3h.01"/>',
  },
  {
    id: 'security',
    label: 'CCTV',
    x: 466,
    y: 252,
    r: 26,
    icon: '<rect x="3.4" y="8.2" width="12.4" height="8.4" rx="2.8"/><path d="M15.8 11.1 20.6 8.6v7.6l-4.8-2.5"/><path d="M7.8 16.6 6.6 20.4"/>',
  },
  {
    id: 'iot',
    label: 'IoT',
    x: 700,
    y: 252,
    r: 26,
    icon: '<path d="M3.8 11.3 12 4.6l8.2 6.7"/><path d="M6.5 11v7.3a1.8 1.8 0 0 0 1.8 1.8h7.4a1.8 1.8 0 0 0 1.8-1.8V11"/><path d="M10.1 15.7a2.7 2.7 0 0 1 3.8 0"/><path d="M12 17.9h.01"/>',
  },
  {
    id: 'iptelephony',
    label: 'SIP',
    x: 700,
    y: 52,
    r: 26,
    icon: '<path d="M7.4 4.4h2.8l1.4 3.6-2 1.5a9.6 9.6 0 0 0 4.9 4.9l1.5-2 3.6 1.4v2.8a1.8 1.8 0 0 1-2 1.8C11.9 17.9 6.1 12.1 5.6 6.4a1.8 1.8 0 0 1 1.8-2Z"/>',
  },
  {
    id: 'aiops',
    label: 'OPS',
    x: 160,
    y: 52,
    r: 26,
    icon: '<rect x="3" y="4.4" width="18" height="15.2" rx="3.2"/><path d="M7.8 10.2l2.6 2.6-2.6 2.6M13.2 15.4h3.4"/>',
  },
];

export const TOPOLOGY_LINKS: TopologyLink[] = [
  { d: 'M 118 150 H 288', len: 170, beam: true },
  { d: 'M 348 150 H 518', len: 170, beam: true },
  { d: 'M 578 150 H 762', len: 184 },
  { d: 'M 318 180 C 318 250, 430 252, 466 252', len: 150 },
  { d: 'M 548 180 C 548 250, 660 252, 700 252', len: 150 },
  { d: 'M 548 120 C 548 56, 660 52, 700 52', len: 140 },
  { d: 'M 318 120 C 318 56, 196 52, 160 52', len: 150 },
];

export const TOPOLOGY_VIEWBOX = '44 14 800 292';

import {
  Monitor,
  Network,
  Phone,
  ShieldCheck,
  Terminal,
  House,
  ShieldAlert,
  Container,
  Server,
  Cable,
  Bot,
  BrainCircuit,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type GlowColor = 'blue' | 'green' | 'cyan';

/** Kurs identifikatorlari — i18n kalitlari va forma qiymatlari bilan bir xil */
export type CourseId =
  | 'computer'
  | 'cisco'
  | 'iptelephony'
  | 'security'
  | 'linux'
  | 'iot'
  // Tayyorlanmoqda (status: 'soon')
  | 'cybersecurity'
  | 'devops'
  | 'windows'
  | 'cabling'
  | 'aicoding'
  | 'aiops'
  | 'aibasics';

/**
 * Katalog guruhi:
 *  - 'profession' — oylar davom etadigan to'liq kasb dasturi;
 *  - 'skill' — qisqa, bitta ko'nikmaga qaratilgan intensiv (soatlarda).
 */
export type CourseKind = 'profession' | 'skill';

export interface Course {
  /** i18n kaliti (Courses.items.<id>) va form qiymati bilan mos */
  id: CourseId;
  level: CourseLevel;
  icon: LucideIcon;
  /** Katalogdagi guruh (kiritilmasa — 'profession') */
  kind?: CourseKind;
  /** Davomiyligi (oy) — PLACEHOLDER, real qiymat bilan almashtiring */
  months: number;
  /**
   * Qisqa kurslar uchun davomiylik (akademik soat). Kiritilsa kartada
   * "oy" o'rniga "soat" ko'rsatiladi.
   */
  hours?: number;
  glow: GlowColor;
  /** Kartada ko'rsatiladigan asosiy mavzular (til-neytral texnologiya nomlari) */
  topics: string[];
  /**
   * 'soon' — kurs hali ishga tushmagan: kartada "Tez orada" belgisi bilan
   * ko'rsatiladi, batafsil sahifasi va arizaga yozilish tugmasi bo'lmaydi.
   * Ishga tushganda shu maydonni olib tashlang va `course-details.ts` ga
   * dastur qo'shing.
   */
  status?: 'soon';
  /**
   * OYLIK narx, so'mda (masalan 980_000).
   * ⚠️ Kiritilmagan bo'lsa narx saytda KO'RSATILMAYDI — taxminiy raqam
   * yozmang, faqat tasdiqlangan narxni qo'ying.
   */
  priceFrom?: number;
}

/* -------------------------------------------------------------------------
 * NARXLAR (priceFrom)
 *
 * Kasb dasturlarida (`kind: 'profession'`) — OYLIK narx, so'mda.
 * Qisqa kurslarda (`kind: 'skill'`) — KURS UCHUN to'liq narx.
 *
 * 1) Asos: ilm.uz ro'yxati (2026-09-21, markaz rahbari yuborgan) —
 *    undan 30% past.
 * 2) Tekshiruv: O'zbekiston bozori (2026-09). Kattalar uchun oflayn IT
 *    kurslari oyiga ~790 000 – 2 190 000 so'm oralig'ida:
 *      - kompyuter savodxonligi (Cyber Science, Toshkent) — 800 000
 *      - Najot Ta'lim (Frontend/Backend, Samarqandda ham bor) — 1 400 000
 *      - Arduino/IoT (oflayn) — 1 190 000, onlayn — 790 000
 *      - ilm.uz (bizning yo'nalish, Toshkent) — 1 300 000 … 2 200 000
 *    Manbalar: spot.uz IT-kurslar sharhi, darslinker.uz, kursi24.uz,
 *    cyberscience.uz, ilm.uz.
 *
 *   Kurs                      ilm.uz     −30%        Yakuniy    Izoh
 *   Cisco / MikroTik          1 400 000  980 000     980 000    bozor o'rtasi
 *   Linux administratsiya     1 500 000  1 050 000   1 050 000  bozor o'rtasi
 *   Xavfsizlik & CCTV         1 300 000  910 000     910 000    bozor o'rtasi
 *   IP-telefoniya             2 000 000  1 400 000   1 250 000  1.4 mln bozor
 *                                                               shiftida edi —
 *                                                               Samarqand uchun
 *                                                               tushirildi
 *   Kompyuter savodxonligi    —          —           650 000    bozordan ~19% past
 *   Aqlli uy & IoT            —          —           950 000    bozordan ~20% past
 *
 * Qisqa AI kurslari — soatiga ~50 000 so'm hisobida (bozordagi oylik
 * narx/soat nisbati bilan bir xil), kurs uchun to'liq narx.
 * ------------------------------------------------------------------------- */
export const COURSES: Course[] = [
  {
    id: 'computer',
    level: 'beginner',
    icon: Monitor,
    months: 2,
    glow: 'cyan',
    topics: ['Windows', 'MS Office', 'Internet'],
    priceFrom: 650_000,
  },
  {
    id: 'cisco',
    level: 'intermediate',
    icon: Network,
    months: 3,
    glow: 'blue',
    topics: ['CCNA', 'VLAN', 'VPN', 'MikroTik'],
    priceFrom: 980_000,
  },
  {
    id: 'iptelephony',
    level: 'intermediate',
    icon: Phone,
    months: 2,
    glow: 'blue',
    topics: ['Asterisk', 'FreePBX', 'SIP'],
    priceFrom: 1_250_000,
  },
  {
    id: 'security',
    level: 'advanced',
    icon: ShieldCheck,
    months: 3,
    glow: 'green',
    topics: ['IP CCTV', 'DVR/NVR', 'PoE'],
    priceFrom: 910_000,
  },
  {
    id: 'linux',
    level: 'advanced',
    icon: Terminal,
    months: 4,
    glow: 'green',
    topics: ['Bash', 'Docker', 'DevOps'],
    priceFrom: 1_050_000,
  },
  {
    id: 'iot',
    level: 'beginner',
    icon: House,
    months: 2,
    glow: 'cyan',
    topics: ['Arduino', 'Raspberry Pi', 'Smart Home'],
    priceFrom: 950_000,
  },

  /* --------------------- Tayyorlanmoqda (tez orada) ---------------------
   * Bozor tahlili asosida tanlangan yo'nalishlar. Ishga tushirilganda
   * `status` ni olib tashlang va `course-details.ts` ga dastur qo'shing.
   * -------------------------------------------------------------------- */
  {
    id: 'cybersecurity',
    level: 'advanced',
    icon: ShieldAlert,
    months: 3,
    glow: 'green',
    topics: ['Firewall', 'VPN', 'IDS', 'Pentest'],
    status: 'soon',
  },
  {
    id: 'devops',
    level: 'advanced',
    icon: Container,
    months: 4,
    glow: 'blue',
    topics: ['Docker', 'Kubernetes', 'CI/CD', 'Ansible'],
    status: 'soon',
  },
  {
    id: 'windows',
    level: 'intermediate',
    icon: Server,
    months: 3,
    glow: 'blue',
    topics: ['Windows Server', 'Active Directory', 'GPO'],
    status: 'soon',
  },
  {
    id: 'cabling',
    level: 'beginner',
    icon: Cable,
    kind: 'skill',
    months: 1,
    hours: 24,
    glow: 'cyan',
    topics: ['SCS', 'UTP', 'Patch panel', 'Tester'],
    status: 'soon',
  },

  /* ------------------------ AI yo'nalishi (qisqa) -----------------------
   * Bozorda eng tez o'sayotgan segment. Samarqandda IT STEP ham AI kursi
   * ochgan, Najot Ta'lim va EdFix'da prompt-injiniring bor — lekin amaliy
   * agent vositalari (Claude Code, Codex) bo'yicha kurs yo'q.
   * NETLAB uchun qisqa intensiv formatda: markaz asoschisi bu vositalar
   * bilan kundalik ishlaydi.
   * -------------------------------------------------------------------- */
  {
    id: 'aicoding',
    level: 'intermediate',
    icon: Bot,
    kind: 'skill',
    months: 1,
    hours: 20,
    glow: 'blue',
    topics: ['Claude Code', 'Codex', 'MCP', 'Git'],
    priceFrom: 1_100_000,
  },
  {
    id: 'aiops',
    level: 'intermediate',
    icon: BrainCircuit,
    kind: 'skill',
    months: 1,
    hours: 16,
    glow: 'green',
    topics: ['Claude', 'Bash', 'Log analysis', 'Automation'],
    priceFrom: 900_000,
  },
  {
    id: 'aibasics',
    level: 'beginner',
    icon: Sparkles,
    kind: 'skill',
    months: 1,
    hours: 12,
    glow: 'cyan',
    topics: ['ChatGPT', 'Claude', 'Prompt', 'Office AI'],
    priceFrom: 600_000,
  },
];

/** Katalog guruhi (kiritilmagan bo'lsa — to'liq kasb dasturi) */
export function courseKind(course: Course): CourseKind {
  return course.kind ?? 'profession';
}

/** Ishga tushgan kurslar — batafsil sahifasi va arizasi bor */
export const ACTIVE_COURSES = COURSES.filter((c) => c.status !== 'soon');

/** Tayyorlanayotgan kurslar */
export const SOON_COURSES = COURSES.filter((c) => c.status === 'soon');

export const COURSE_LEVELS: CourseLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
];

// Ikonka rangi glow turiga mos
export const GLOW_TEXT: Record<GlowColor, string> = {
  blue: 'text-primary',
  green: 'text-accent',
  cyan: 'text-tech-cyan',
};

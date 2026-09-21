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
 * NARXLAR (priceFrom) — oylik, so'mda.
 *
 * Manba: ilm.uz kurslar ro'yxati (2026-09-21 holatiga) — markaz rahbari
 * yuborgan skrinshotlar. Siyosat: ilm.uz narxidan **30% past**.
 *
 *   ilm.uz kursi                          ilm.uz      NETLAB (−30%)
 *   Cisco CCNA / Tarmoq admin             1 400 000   980 000    → cisco
 *   IP-telefoniya                         2 000 000   1 400 000  → iptelephony
 *   Videokuzatuv tizimlari                1 300 000   910 000    → security
 *   Linux Server / Tizim admin            1 500 000   1 050 000  → linux
 *
 * `computer` va `iot` da ilm.uz'da ekvivalent kurs yo'q — narx tasdiqlangunga
 * qadar bo'sh qoladi va kartada ko'rsatilmaydi.
 * Tayyorlanayotgan kurslarda (`status: 'soon'`) narx ataylab yo'q: guruh
 * ochilganda tasdiqlanadi.
 * ------------------------------------------------------------------------- */
export const COURSES: Course[] = [
  {
    id: 'computer',
    level: 'beginner',
    icon: Monitor,
    months: 2,
    glow: 'cyan',
    topics: ['Windows', 'MS Office', 'Internet'],
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
    priceFrom: 1_400_000,
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
    topics: ['SKS', 'UTP', 'Patch panel', 'Tester'],
    status: 'soon',
  },

  /* ------------------------ AI yo'nalishi (qisqa) -----------------------
   * Bozorda eng tez o'sayotgan segment (Skillbox, OTUS, Slurm, Merion —
   * hammasida bor). NETLAB uchun qisqa intensiv formatda: markaz asoschisi
   * bu vositalar bilan kundalik ishlaydi.
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
    status: 'soon',
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
    status: 'soon',
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
    status: 'soon',
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

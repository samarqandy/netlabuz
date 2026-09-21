import { Network, ShieldCheck, Radio, type LucideIcon } from 'lucide-react';

import type { CourseId } from './courses';

/* =========================================================================
 * Karyera yo'llari (tracks).
 *
 * MUHIM: yo'llar FAQAT mavjud kurslardan tuziladi — bu yangi xizmat emas,
 * balki tavsiya etilgan o'rganish tartibi. Yangi kurs qo'shilsa, uni mos
 * yo'lning `courses` massiviga qo'shing (tartib = o'rganish ketma-ketligi).
 *
 * Matnlar: messages/{uz,ru,en}.json -> Tracks.items.<id>
 * ========================================================================= */

export interface Track {
  id: string;
  icon: LucideIcon;
  /** Kurslar o'rganish tartibida */
  courses: CourseId[];
  glow: 'blue' | 'green' | 'cyan';
}

export const TRACKS: Track[] = [
  {
    id: 'network',
    icon: Network,
    courses: ['computer', 'cisco', 'linux'],
    glow: 'blue',
  },
  {
    id: 'security',
    icon: ShieldCheck,
    courses: ['computer', 'cisco', 'security'],
    glow: 'green',
  },
  {
    id: 'communications',
    icon: Radio,
    courses: ['cisco', 'iptelephony', 'iot'],
    glow: 'cyan',
  },
];

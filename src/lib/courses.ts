import {
  Monitor,
  Network,
  Phone,
  ShieldCheck,
  Terminal,
  House,
  type LucideIcon,
} from 'lucide-react';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type GlowColor = 'blue' | 'green' | 'cyan';

export interface Course {
  /** i18n kaliti (Courses.items.<id>) va form qiymati bilan mos */
  id: string;
  level: CourseLevel;
  icon: LucideIcon;
  /** Davomiyligi (oy) — PLACEHOLDER, real qiymat bilan almashtiring */
  months: number;
  glow: GlowColor;
  /** Kartada ko'rsatiladigan asosiy mavzular (til-neytral texnologiya nomlari) */
  topics: string[];
}

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
  },
  {
    id: 'iptelephony',
    level: 'intermediate',
    icon: Phone,
    months: 2,
    glow: 'blue',
    topics: ['Asterisk', 'FreePBX', 'SIP'],
  },
  {
    id: 'security',
    level: 'advanced',
    icon: ShieldCheck,
    months: 3,
    glow: 'green',
    topics: ['IP CCTV', 'DVR/NVR', 'PoE'],
  },
  {
    id: 'linux',
    level: 'advanced',
    icon: Terminal,
    months: 4,
    glow: 'green',
    topics: ['Bash', 'Docker', 'DevOps'],
  },
  {
    id: 'iot',
    level: 'beginner',
    icon: House,
    months: 2,
    glow: 'cyan',
    topics: ['Arduino', 'Raspberry Pi', 'Smart Home'],
  },
];

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

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
}

export const COURSES: Course[] = [
  { id: 'computer', level: 'beginner', icon: Monitor, months: 2, glow: 'cyan' },
  { id: 'cisco', level: 'intermediate', icon: Network, months: 3, glow: 'blue' },
  { id: 'iptelephony', level: 'intermediate', icon: Phone, months: 2, glow: 'blue' },
  { id: 'security', level: 'advanced', icon: ShieldCheck, months: 3, glow: 'green' },
  { id: 'linux', level: 'advanced', icon: Terminal, months: 4, glow: 'green' },
  { id: 'iot', level: 'beginner', icon: House, months: 2, glow: 'cyan' },
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

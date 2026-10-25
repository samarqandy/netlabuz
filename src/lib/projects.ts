import { Network, Cctv, Server, House, Cable, type LucideIcon } from 'lucide-react';

import type { CourseId } from './courses';

/* =========================================================================
 * Amaliy loyihalar — "o'rganib nima quraman?" degan savolning javobi.
 *
 * Bu YANGI KURS EMAS va kurslar katalogini takrorlamaydi: har loyiha bir
 * nechta MAVJUD kursni birlashtiradigan bitiruv ishi.
 *
 * ⚠️ IKKI QAT'IY QOIDA:
 *   1. Loyiha faqat `lab.ts` da tasdiqlangan uskunalarga tayanishi kerak.
 *      Markazda yo'q asbob (masalan OTDR yoki payvandlash apparati) talab
 *      qiladigan loyiha bu yerga yozilmaydi.
 *   2. Tayanch kurslar faol bo'lishi kerak ('soon' emas) — aks holda karta
 *      mavjud bo'lmagan sahifaga yo'naltiradi.
 *
 * Matnlar: messages/{uz,ru,en}.json -> Projects.items.<id>
 * ========================================================================= */

export interface LabProject {
  id: string;
  icon: LucideIcon;
  /** Loyihada ishlatiladigan uskuna/texnologiya (til-neytral teglar) */
  tech: string[];
  /** Loyiha tayangan kurslar — o'rganish tartibida */
  courses: CourseId[];
  glow: 'blue' | 'green' | 'cyan';
}

export const LAB_PROJECTS: LabProject[] = [
  {
    id: 'office',
    icon: Network,
    tech: ['MikroTik', 'Cisco', 'VLAN', 'Fortigate', 'Wi-Fi', 'Asterisk'],
    courses: ['cisco', 'linux', 'iptelephony'],
    glow: 'blue',
  },
  {
    id: 'cctv',
    icon: Cctv,
    tech: ['Hikvision', 'Dahua', 'IP kamera', 'NVR', 'PoE switch'],
    courses: ['security', 'cisco'],
    glow: 'cyan',
  },
  {
    id: 'datacenter',
    icon: Server,
    tech: ['Ubuntu Server', 'NAS', 'RAID', 'DNS', 'DHCP', 'Backup'],
    courses: ['linux', 'cisco'],
    glow: 'green',
  },
  {
    id: 'fiber',
    icon: Cable,
    tech: ['Optik tola', 'OTDR', 'Optical Power Meter', 'Payvandlash', 'GPON'],
    courses: ['cabling', 'cisco'],
    glow: 'cyan',
  },
  {
    id: 'smarthome',
    icon: House,
    tech: ['ESP32', 'Arduino', 'Sensor', 'Wi-Fi'],
    courses: ['iot', 'linux'],
    glow: 'blue',
  },
];

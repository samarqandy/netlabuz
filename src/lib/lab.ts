import {
  Router,
  Server,
  Cctv,
  PhoneCall,
  CircuitBoard,
  MonitorSmartphone,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================================
 * Laboratoriya — markazdagi uskunalar.
 *
 * ⚠️ MUHIM: bu yerda FAQAT kurslarda haqiqatan ishlatiladigan texnologiyalar
 * sanab o'tilgan. Aniq modellar va SONLAR ataylab yozilmagan — ularni
 * tasdiqlangan holda o'zingiz qo'shing (masalan 'Cisco 2911' yoki '8 ta
 * RouterBOARD'). Tasdiqlanmagan raqam yozmang: raqobatchilar aynan shu
 * tafsilot bilan ishonch qozonadi, noto'g'risi esa teskari ishlaydi.
 *
 * Matnlar: messages/{uz,ru,en}.json -> Lab
 * ========================================================================= */

export interface LabCategory {
  /** messages: Lab.categories.<key> */
  key: string;
  icon: LucideIcon;
  /** Uskuna/texnologiya nomlari (til-neytral). Model qo'shsangiz shu yerga. */
  items: string[];
  glow: 'blue' | 'green' | 'cyan';
}

export const LAB_CATEGORIES: LabCategory[] = [
  {
    key: 'network',
    icon: Router,
    items: ['Cisco', 'MikroTik', 'Switch', 'Patch panel'],
    glow: 'blue',
  },
  {
    key: 'servers',
    icon: Server,
    items: ['Ubuntu Server', 'Docker', 'Nginx'],
    glow: 'green',
  },
  {
    key: 'cctv',
    icon: Cctv,
    items: ['IP kamera', 'NVR', 'PoE switch'],
    glow: 'cyan',
  },
  {
    key: 'telephony',
    icon: PhoneCall,
    items: ['Asterisk', 'FreePBX', 'SIP'],
    glow: 'blue',
  },
  {
    key: 'iot',
    icon: CircuitBoard,
    items: ['Arduino', 'ESP32', 'Raspberry Pi', 'Sensor'],
    glow: 'green',
  },
  {
    key: 'workstations',
    icon: MonitorSmartphone,
    items: ['Windows 11', 'MS Office', 'Packet Tracer'],
    glow: 'cyan',
  },
];

/**
 * Laboratoriya ochiq bo'ladigan vaqt (masalan "09:00 — 20:00").
 * Bo'sh bo'lsa — bu belgi saytda ko'rsatilmaydi.
 * Raqobatchilarning kuchli tomoni: o'quvchi darsdan tashqari ham mashq qiladi.
 */
export const LAB_OPEN_HOURS = '';

/**
 * Laboratoriya suratlari. Bo'sh bo'lsa galereya ko'rsatilmaydi.
 * Suratlarni `public/lab/` ga qo'ying va shu yerga yo'lini yozing.
 * `alt` — messages: Lab.photos.<altKey>
 */
export const LAB_PHOTOS: { src: string; altKey: string }[] = [];

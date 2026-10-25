import {
  Router,
  Server,
  Cctv,
  PhoneCall,
  CircuitBoard,
  MonitorSmartphone,
  Cable,
  RadioTower,
  BrainCircuit,
  Gauge,
  Activity,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================================
 * Laboratoriya — markazdagi uskunalar.
 *
 * ⚠️ MUHIM: bu yerda FAQAT markazda haqiqatan bor uskunalar sanab o'tilgan.
 * Ro'yxat egasi tomonidan tasdiqlangan (2026-10).
 *
 * Aniq MODELLAR va SONLAR ataylab yozilmagan — ularni tasdiqlangan holda
 * o'zingiz qo'shing (masalan 'Cisco 2911' yoki '8 ta RouterBOARD'). Model
 * qo'shilsa ishonch kuchayadi, noto'g'ri raqam esa teskari ishlaydi.
 *
 * Brend nomlari faqat "bizda shu uskuna bor" degan ma'noda. Vakillik,
 * sheriklik yoki akademiya maqomi DA'VO QILINMAYDI — logotip qo'ymang va
 * "rasmiy" so'zini yozmang.
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
  /**
   * Karta tepasidagi surat — ixtiyoriy. Kiritilmasa karta avvalgidek,
   * suratsiz chiqadi.
   *
   * ⚠️ FAQAT markazning O'Z laboratoriyasida olingan haqiqiy surat.
   * Bo'limning sarlavhasi "Simulyatorda emas — haqiqiy uskunalarda":
   * boshqa joydan olingan yoki sun'iy intellekt chizgan rasm aynan shu
   * da'voni yo'qqa chiqaradi.
   *
   * Suratni `public/lab/` ga qo'ying va yo'lini yozing: '/lab/network.jpg'.
   * Tavsiya etilgan nisbat 16:9, eni kamida 960px.
   */
  photo?: string;
}

export const LAB_CATEGORIES: LabCategory[] = [
  {
    key: 'network',
    icon: Router,
    items: ['Cisco', 'Huawei', 'MikroTik', 'Fortigate', 'NTP', 'Konsol (COM)'],
    glow: 'blue',
  },
  {
    key: 'optics',
    icon: Cable,
    items: ['Optik tola', 'GPON', 'SFP modul', 'Patch-kord', 'Patch panel'],
    glow: 'green',
  },
  {
    key: 'fiberTools',
    icon: Gauge,
    items: ['OTDR', 'Optical Power Meter', 'Payvandlash apparati', 'Kabel tester'],
    glow: 'cyan',
  },
  {
    key: 'servers',
    icon: Server,
    items: ['Proxmox VE', 'KVM', 'TrueNAS', 'FreeIPA', 'NAS', 'RAID', 'Ubuntu Server'],
    glow: 'blue',
  },
  {
    key: 'monitoring',
    icon: Activity,
    items: ['Zabbix', 'SNMP', 'Syslog', 'NetBox', 'Wireshark', 'Wazuh', 'Ansible'],
    glow: 'green',
  },
  {
    key: 'cctv',
    icon: Cctv,
    items: ['Hikvision', 'Dahua', 'IP kamera', 'NVR', 'PoE switch'],
    glow: 'blue',
  },
  {
    key: 'wireless',
    icon: RadioTower,
    items: ['Wi-Fi', 'Radio aloqa'],
    glow: 'green',
  },
  {
    key: 'telephony',
    icon: PhoneCall,
    items: ['Asterisk', 'FreePBX', 'SIP'],
    glow: 'cyan',
  },
  {
    key: 'iot',
    icon: CircuitBoard,
    items: ['Arduino', 'ESP32', 'Raspberry Pi', 'Sensor'],
    glow: 'blue',
  },
  {
    key: 'ai',
    icon: BrainCircuit,
    items: ['Claude', 'ChatGPT'],
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

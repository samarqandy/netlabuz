/* =========================================================================
 * "Paket yo'li" sahnasi uchun ma'lumot.
 *
 * Bitta so'rov besh qurilmadan o'tadi: ofis tarmog'ida PC → switch → router,
 * internet orqali data-markazga, u yerda firewall → server. Har qadam
 * kursning aniq moduliga bog'langan, modul nomi `CourseDetail.<id>.modules`
 * dan olinadi, ya'ni kurs dasturi o'zgarsa bu yer ham o'zi yangilanadi.
 *
 * Qurilma ikonkalari topologiya bilan bir xil uslubda (24×24, yumaloq chiziq).
 * Matnlar: messages/{uz,ru,en}.json → PacketJourney
 * ========================================================================= */

import type { CourseId } from './courses';
import { TOPOLOGY_NODES } from './topology';

const iconOf = (id: CourseId) =>
  TOPOLOGY_NODES.find((n) => n.id === id)?.icon ?? '';

export interface JourneyNode {
  id: 'pc' | 'switch' | 'router' | 'firewall' | 'server';
  /** Til-neytral yorliq — topologiyadagi kabi bosh harflarda */
  label: string;
  icon: string;
}

export const JOURNEY_NODES: JourneyNode[] = [
  { id: 'pc', label: 'PC', icon: iconOf('computer') },
  { id: 'switch', label: 'SWITCH', icon: iconOf('cisco') },
  {
    id: 'router',
    label: 'ROUTER',
    icon: '<rect x="3" y="12.5" width="18" height="7" rx="2.6"/><path d="M7 16h.01M10.5 16h.01"/><path d="M15.5 12.5V8.2M18.5 12.5V5.8"/>',
  },
  {
    id: 'firewall',
    label: 'FIREWALL',
    icon: '<path d="M12 3.4 19 6v5.4c0 4.4-2.9 7.8-7 9.2-4.1-1.4-7-4.8-7-9.2V6l7-2.6Z"/><path d="M9 12.2l2.1 2.1 4-4.1"/>',
  },
  { id: 'server', label: 'SERVER', icon: iconOf('linux') },
];

export interface JourneyStep {
  /** messages: PacketJourney.steps.<id> */
  id: string;
  /** Qaysi qurilmada; null — butun zanjir (yakuniy kuzatuv qadami) */
  node: number | null;
  /** Paket ustidagi yorliq: shu bosqichda nima tekshiriladi */
  tag: string;
  course: CourseId;
  /** Kurs moduli kaliti; 'tez orada' kursda modul yo'q */
  module?: string;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  { id: 'request', node: 0, tag: 'DNS', course: 'cisco', module: 'services' },
  { id: 'lan', node: 1, tag: 'MAC', course: 'cisco', module: 'switching' },
  { id: 'route', node: 2, tag: 'IP', course: 'cisco', module: 'routing' },
  { id: 'inspect', node: 3, tag: '443 ✓', course: 'cybersecurity' },
  { id: 'response', node: 4, tag: '200 OK', course: 'linux', module: 'services' },
  { id: 'monitor', node: null, tag: '✓', course: 'noc', module: 'zabbix' },
];

/* ---------------- vaqt chizig'i (scroll'ga bog'langan) -------------------
 * Birlik — shartli vaqt. Har tugunda 1 birlik turadi, keyingisiga 1 birlikda
 * o'tadi: tugun i ga yetib kelish vaqti = 2i. Serverdan keyin javob 1
 * birlikda orqaga qaytadi, oxirgi 1 birlik — kuzatuv qadami.
 * ------------------------------------------------------------------------ */
export const JOURNEY_TOTAL = 11;

/** Vaqtdan faol qadamni topadi */
export function journeyStepAt(t: number): number {
  return t < 10 ? Math.min(4, Math.max(0, Math.floor(t / 2))) : 5;
}

/** SVG koordinatalari: tugunlar bir qatorda, oralig'i 200 */
export const JOURNEY_X = [100, 300, 500, 700, 900];
export const JOURNEY_Y = 128;

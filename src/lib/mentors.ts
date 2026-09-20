/* =========================================================================
 * Ustozlar ma'lumotlari.
 *
 * MUHIM: MENTORS bo'sh bo'lsa, Mentors seksiyasi saytda KO'RINMAYDI.
 * Haqiqiy ustozlar ma'lumotini (rozilik bilan) quyidagi formatda qo'shing —
 * seksiya avtomatik paydo bo'ladi. `photo` ixtiyoriy: public/mentors/
 * papkasiga surat qo'yib, yo'lini yozing (masalan '/mentors/aziz.jpg');
 * surat bo'lmasa ism bosh harfidan avatar chiqadi.
 *
 * Namuna:
 * {
 *   name: 'Aziz Karimov',
 *   role: {
 *     uz: 'Tarmoq muhandisi, CCNA',
 *     ru: 'Сетевой инженер, CCNA',
 *     en: 'Network engineer, CCNA',
 *   },
 *   topics: ['Cisco', 'MikroTik'],
 *   photo: '/mentors/aziz.jpg',
 * }
 * ========================================================================= */

export interface Mentor {
  name: string;
  /** Lavozim/mutaxassislik — har uch tilda */
  role: { uz: string; ru: string; en: string };
  /** O'rgatadigan texnologiyalar (til-neytral) */
  topics: string[];
  /** Ixtiyoriy surat yo'li (public/ ga nisbatan) */
  photo?: string;
}

export const MENTORS: Mentor[] = [];

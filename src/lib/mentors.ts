/* =========================================================================
 * Ustozlar ma'lumotlari.
 *
 * MUHIM: MENTORS bo'sh bo'lsa, Mentors seksiyasi saytda KO'RINMAYDI.
 * Faqat TASDIQLANGAN ma'lumot yoziladi — quyidagi yozuv markaz asoschisining
 * o'z rezyumesidan olingan (2026-09, o'zi yubordi). Yangi ustoz qo'shganda
 * ham ma'lumotni va rozilikni o'sha odamdan oling.
 *
 * `photo` ixtiyoriy: public/mentors/ papkasiga surat qo'yib, yo'lini yozing
 * (masalan '/mentors/suxrob.jpg'); surat bo'lmasa ism bosh harfidan avatar
 * chiqadi.
 * ========================================================================= */

export interface Mentor {
  name: string;
  /** Lavozim/mutaxassislik — har uch tilda */
  role: { uz: string; ru: string; en: string };
  /** Qisqa tarjimai hol — har uch tilda (ixtiyoriy) */
  bio?: { uz: string; ru: string; en: string };
  /** O'rgatadigan texnologiyalar (til-neytral) */
  topics: string[];
  /**
   * Sertifikatlar — faqat haqiqatda olingan va amaldagilari.
   * ⚠️ Bu shaxsiy sertifikatlar; markazning vendor akademiyasi maqomi
   * (Cisco NetAcad, MikroTik Academy) emas — shunday deb yozilmasin.
   */
  credentials?: string[];
  /** Sohadagi umumiy tajriba (yil) */
  experienceYears?: number;
  /** Shaxsiy sayt (ixtiyoriy) */
  site?: string;
  /** Ixtiyoriy surat yo'li (public/ ga nisbatan) */
  photo?: string;
  /** Asosiy ustoz — kartasi keng va batafsil ko'rsatiladi */
  lead?: boolean;
}

export const MENTORS: Mentor[] = [
  {
    name: 'Suxrob Xaydarov',
    lead: true,
    role: {
      uz: "Asoschi va bosh o'qituvchi · tizim va tarmoq muhandisi",
      ru: 'Основатель и ведущий преподаватель · системный и сетевой инженер',
      en: 'Founder and lead instructor · systems and network engineer',
    },
    bio: {
      uz: "Telekommunikatsiya va IT sohasida 15 yildan ortiq tajriba. «O'zaeronavigatsiya markazi»da ATSEP muhandisi — havo harakatini boshqarish, aloqa va navigatsiya tizimlariga xizmat ko'rsatadi. SAM Smart Security Service asoschisi: 1000 dan ortiq kichik va 50 dan ortiq yirik loyiha. School 21 Samarqand kampusida tizim administratori bo'yicha bosh mutaxassis bo'lib ishlagan.",
      ru: 'Более 15 лет опыта в телекоммуникациях и IT. Инженер ATSEP в «Узаэронавигации» — обслуживает системы управления воздушным движением, связи и навигации. Основатель SAM Smart Security Service: более 1000 малых и 50 крупных проектов. Работал главным специалистом по системному администрированию в кампусе School 21 в Самарканде.',
      en: 'More than 15 years in telecoms and IT. ATSEP engineer at Uzaeronavigatsiya, maintaining air traffic control, communication and navigation systems. Founder of SAM Smart Security Service: 1000+ small and 50+ large projects. Former lead systems administration specialist at the School 21 campus in Samarkand.',
    },
    topics: [
      'MikroTik',
      'Cisco',
      'Linux',
      'Proxmox',
      'Zabbix',
      'FortiGate',
      'VoIP',
      'CCTV',
    ],
    credentials: [
      'MikroTik MTCNA',
      'MikroTik MTCRE',
      'MikroTik MTCTCE',
      'Dahua DHSP',
      'Linux Essentials',
      'ATSEP (CNS/ATM)',
    ],
    experienceYears: 15,
    site: 'https://khaydarov.uz',
  },
];

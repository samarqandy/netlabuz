import { SectionHeading } from 'netlabuz';

export const Centered = () => (
  <div style={{ maxWidth: 560 }}>
    <SectionHeading
      eyebrow="Kurslar"
      title="Nimani o'rganasiz?"
      subtitle="Barcha kurslar haqiqiy uskunalarda amaliy laboratoriya ishi bilan — haqiqiy stsenariylar."
    />
  </div>
);

export const LeftAligned = () => (
  <div style={{ maxWidth: 560 }}>
    <SectionHeading
      align="left"
      eyebrow="Nega biz"
      title="Raqamlarda NETLAB"
      subtitle="Yillar davomidagi natijalarimiz va ishonchimiz."
    />
  </div>
);

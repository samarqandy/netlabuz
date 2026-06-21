import { setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/hero';
import { Courses } from '@/components/sections/courses';

// Keyingi bosqichlarda to'ldiriladigan seksiyalar uchun vaqtinchalik anchorlar
const PLACEHOLDER_SECTIONS = [
  'how',
  'why',
  'testimonials',
  'gallery',
  'contact',
] as const;

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Courses />

      {/* TODO (keyingi bosqichlar): Qanday ishlaydi, Nega biz,
          Fikrlar, Galereya, Aloqa seksiyalari shu yerga keladi */}
      {PLACEHOLDER_SECTIONS.map((id) => (
        <section
          key={id}
          id={id}
          className="container scroll-mt-20 py-24 text-center text-muted-foreground"
        >
          <span className="text-sm uppercase tracking-widest">{id}</span>
        </section>
      ))}
    </>
  );
}

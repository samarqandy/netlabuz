import { setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/hero';
import { Courses } from '@/components/sections/courses';
import { Stats } from '@/components/sections/stats';
import { Process } from '@/components/sections/process';
import { Contact } from '@/components/sections/contact';

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
      <Stats />
      <Process />
      <Contact />
    </>
  );
}

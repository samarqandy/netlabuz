import { useTranslations } from 'next-intl';
import { ArrowLeft, WifiOff } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div className="container flex flex-col items-center text-center">
        <div className="mb-6 grid size-16 place-items-center rounded-2xl border border-border bg-secondary/40 text-accent">
          <WifiOff className="size-8" strokeWidth={1.5} />
        </div>
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          {t('code')}
        </p>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          {t('description')}
        </p>
        <Button asChild variant="accent" size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeft className="size-4" /> {t('cta')}
          </Link>
        </Button>
      </div>
    </section>
  );
}

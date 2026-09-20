'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, ServerCrash } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-16">
      <div className="container flex flex-col items-center text-center">
        <div className="mb-6 grid size-16 place-items-center rounded-2xl border border-border bg-secondary/40 text-destructive">
          <ServerCrash className="size-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          {t('description')}
        </p>
        <Button variant="accent" size="lg" className="mt-8" onClick={reset}>
          <RefreshCw className="size-4" /> {t('cta')}
        </Button>
      </div>
    </section>
  );
}

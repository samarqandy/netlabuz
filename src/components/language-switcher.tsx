'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Globe } from 'lucide-react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheck,
} from '@/components/ui/dropdown-menu';

const LABELS: Record<string, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Language');
  const router = useRouter();
  const pathname = usePathname();
  // Dinamik yo'llar ([slug]) uchun route parametrlari ham kerak —
  // aks holda /uz/kurslar/cisco → /ru/kursy/[slug] bo'lib qolardi
  const params = useParams();
  const [isPending, startTransition] = React.useTransition();

  function onSelect(next: string) {
    if (next === locale) return;
    startTransition(() => {
      // Joriy yo'lni (va uning parametrlarini) saqlab, tilni almashtiramiz.
      // pathname runtime'da aniqlanadi, shuning uchun href tipini keng olamiz.
      const href = { pathname, params } as Parameters<typeof router.replace>[0];
      router.replace(href, { locale: next });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('label')}
          disabled={isPending}
        >
          <Globe className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={() => onSelect(loc)}
            className="justify-between"
          >
            <span>{LABELS[loc]}</span>
            {loc === locale && (
              <DropdownMenuCheck className="size-4 text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

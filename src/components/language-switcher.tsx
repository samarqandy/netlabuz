'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
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
  const [isPending, startTransition] = React.useTransition();

  function onSelect(next: string) {
    if (next === locale) return;
    startTransition(() => {
      // Joriy yo'lni saqlab, tilni almashtiramiz
      router.replace(pathname, { locale: next });
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

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Kichik yuqori yorliq (masalan "KURSLAR") */
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

/**
 * Seksiya sarlavhasi bloki — eyebrow + sarlavha + subtitle.
 * Prezentatsion (server-safe). Animatsiya kerak bo'lsa <Reveal> bilan o'rang.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <span className="h-px w-6 bg-accent/60" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

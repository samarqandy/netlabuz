import { cn } from '@/lib/utils';

/* =========================================================================
 * NETLAB brend belgisi.
 *
 * Belgi — pastga qarab yaqinlashuvchi uchburchak ko'rinishidagi 45 ta nuqta
 * (9 qator: 9→1, o'lcham pastga qarab kattalashadi). Geometriya rasmiy
 * logotipdan o'lchab olingan va shu yerda vektor sifatida qayta tiklangan:
 * har qanday o'lchamda tiniq, `currentColor` orqali mavzuga moslashadi.
 *
 * Variantlar:
 *   full    — to'liq belgi. Navbar, footer, OG rasm (balandlik >= 24px).
 *   compact — pastki 5 qator (15 nuqta). Favicon va ilova ikonkalari uchun:
 *             16–64px da to'liq belgining yuqori nuqtalari subpiksel bo'lib
 *             ko'rinmay qoladi, ixcham variant esa aniq o'qiladi.
 * ========================================================================= */

/** Nuqtalar orasidagi gorizontal qadam */
const SPACING = 117.6;
/** Belgi markazi (original koordinatalarda) */
const CENTER_X = 481.95;
/** Qatorlar: radius va markaz-Y (yuqoridan pastga) */
const ROWS = [
  { r: 11.55, y: 11.55 },
  { r: 12.9, y: 39.25 },
  { r: 16.0, y: 72.55 },
  { r: 21.75, y: 116.65 },
  { r: 26.4, y: 170.75 },
  { r: 31.25, y: 234.85 },
  { r: 38.5, y: 313.65 },
  { r: 45.75, y: 413.45 },
  { r: 55.5, y: 529.55 },
] as const;

interface Dot {
  cx: number;
  cy: number;
  r: number;
}

/** `from` qatoridan boshlab nuqtalarni va mos viewBox'ni hisoblaydi */
function buildMark(from: number) {
  const dots: Dot[] = [];
  for (let i = from; i < ROWS.length; i++) {
    const { r, y } = ROWS[i];
    const count = ROWS.length - i;
    for (let k = 0; k < count; k++) {
      dots.push({ cx: CENTER_X + (k - (count - 1) / 2) * SPACING, cy: y, r });
    }
  }
  const minX = Math.min(...dots.map((d) => d.cx - d.r));
  const minY = Math.min(...dots.map((d) => d.cy - d.r));
  const width = Math.max(...dots.map((d) => d.cx + d.r)) - minX;
  const height = Math.max(...dots.map((d) => d.cy + d.r)) - minY;

  return {
    viewBox: `0 0 ${round(width)} ${round(height)}`,
    dots: dots.map((d) => ({
      cx: round(d.cx - minX),
      cy: round(d.cy - minY),
      r: round(d.r),
    })),
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

const MARKS = {
  full: buildMark(0),
  compact: buildMark(4),
} as const;

export type LogoVariant = keyof typeof MARKS;

/**
 * Belgi geometriyasi (viewBox + nuqtalar) — React'siz kontekstlar uchun,
 * masalan OG rasm generatsiyasi (next/og).
 */
export function getMark(variant: LogoVariant = 'full') {
  return MARKS[variant];
}

export function LogoMark({
  variant = 'full',
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  const mark = MARKS[variant];
  return (
    <svg
      viewBox={mark.viewBox}
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      {mark.dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
      ))}
    </svg>
  );
}

/**
 * Belgi + "NETLAB" so'z-belgisi (lockup).
 * So'z-belgi rasmiy logotipdagi kabi keng harf oralig'i bilan beriladi.
 */
export function Logo({
  className,
  markClassName,
  wordClassName,
  variant = 'full',
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  variant?: LogoVariant;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark variant={variant} className={cn('h-7 w-auto', markClassName)} />
      {showWordmark && (
        <span
          className={cn(
            // pr-[0.22em] — oxirgi harfdan keyingi tracking bo'shlig'ini
            // qoplaydi, aks holda lockup o'ngga qiyshayib ko'rinadi
            'pl-px pr-[0.22em] text-lg font-semibold tracking-[0.22em]',
            wordClassName
          )}
        >
          NETLAB
        </span>
      )}
    </span>
  );
}

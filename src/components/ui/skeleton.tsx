import { cn } from '@/lib/utils';

/**
 * Yuklanish holati uchun "skeleton" — pulse animatsiyali joy egallovchi.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };

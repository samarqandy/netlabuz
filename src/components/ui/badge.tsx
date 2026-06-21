import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/15 text-primary',
        accent: 'border-transparent bg-accent/15 text-accent',
        cyan: 'border-transparent bg-tech-cyan/15 text-tech-cyan',
        outline: 'border-border bg-secondary/40 text-muted-foreground',
        // Kurs darajalari uchun semantik variantlar
        beginner: 'border-transparent bg-accent/15 text-accent',
        intermediate: 'border-transparent bg-tech-cyan/15 text-tech-cyan',
        advanced: 'border-transparent bg-primary/15 text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

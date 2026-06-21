import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Yengil, native <select> asosidagi tanlov maydoni (qo'shimcha JS/dep yo'q).
 * Stil shadcn Input bilan mos; o'ng tomonda chevron ikonkasi.
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'flex h-11 w-full appearance-none rounded-lg border border-input bg-background px-3.5 pr-10 text-sm',
            'ring-offset-background transition-colors duration-200',
            'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30',
            'invalid:text-muted-foreground',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };

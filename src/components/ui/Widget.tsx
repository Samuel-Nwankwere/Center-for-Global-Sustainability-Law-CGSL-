import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Ecofine sidebar widget: soft grey panel with an underlined title. */
export function Widget({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-eco bg-ink-50 p-7 sm:p-8', className)}>
      <h2 className="relative mb-7 pb-4 text-[20px] font-bold text-ink-900 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-12 after:rounded-full after:bg-brand-600">
        {title}
      </h2>
      {children}
    </section>
  );
}

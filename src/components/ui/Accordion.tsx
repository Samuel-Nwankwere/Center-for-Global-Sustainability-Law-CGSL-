import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Ecofine FAQ accordion: the open item gets a solid theme-colour header. */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn('overflow-hidden rounded-[5px] bg-white transition', isOpen ? 'shadow-card' : 'ring-1 ring-ink-200')}>
            <h3>
              <button
                type="button"
                id={`${base}-h${i}`}
                aria-controls={`${base}-p${i}`}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-bold leading-7 transition sm:px-[30px]',
                  isOpen ? 'bg-brand-600 text-white' : 'text-ink-900 hover:text-brand-600',
                )}
              >
                {item.q}
                <span className={cn('grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full', isOpen ? 'bg-white text-brand-600' : 'bg-brand-600 text-white')}>
                  {isOpen ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                </span>
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-h${i}`} hidden={!isOpen} className="px-6 py-5 leading-[27px] text-ink-500 sm:px-[30px]">
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}

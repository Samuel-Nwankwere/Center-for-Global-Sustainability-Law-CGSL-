import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

export function FeatureGrid({ items, columns = 3, tone = 'light' }: { items: Feature[]; columns?: 2 | 3 | 4; tone?: 'light' | 'dark' }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return (
    <div className={cn('grid gap-5', cols)}>
      {items.map((f, i) => (
        <Reveal
          key={f.title}
          delay={(i % columns) * 70}
          className={cn(
            'group rounded-eco p-8 transition duration-300 lg:p-10',
            tone === 'light' ? 'bg-white ring-1 ring-ink-200 hover:shadow-lift hover:ring-transparent' : 'bg-white/[0.07] ring-1 ring-white/15',
          )}
        >
          <span
            className={cn(
              'grid h-[70px] w-[70px] place-items-center rounded-full transition duration-500 group-hover:rotate-[360deg]',
              tone === 'light' ? 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white' : 'bg-white/10 text-brand-200',
            )}
          >
            <Icon name={f.icon} className="h-8 w-8" strokeWidth={1.5} />
          </span>
          <h3 className={cn('mt-6 text-[20px] font-bold leading-[27px]', tone === 'light' ? 'text-ink-900 group-hover:text-brand-600' : 'text-white')}>{f.title}</h3>
          <p className={cn('mt-3 leading-[27px]', tone === 'light' ? 'text-ink-500' : 'text-white/75')}>{f.text}</p>
        </Reveal>
      ))}
    </div>
  );
}

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ Container */
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

/* ------------------------------------------------------------------ Button
   Ecofine "theme-btns": square-ish 5px radius, bold label, double-chevron
   icon, and a diagonal colour sweep on hover. */
type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-light' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white before:bg-ink-900',
  dark: 'bg-ink-900 text-white before:bg-brand-600',
  secondary: 'bg-white text-ink-900 ring-1 ring-inset ring-ink-200 before:bg-brand-600 hover:text-white hover:ring-brand-600',
  ghost: 'text-brand-700 before:bg-brand-50',
  light: 'bg-white text-ink-900 before:bg-brand-600 hover:text-white',
  'outline-light': 'text-white ring-1 ring-inset ring-white/60 before:bg-white hover:text-ink-900',
};
const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-[52px] px-[30px] text-[14px]',
  lg: 'h-14 px-9 text-base',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(
    'group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[5px] font-bold transition-colors duration-500',
    'before:absolute before:inset-0 before:-z-10 before:transition-[clip-path] before:duration-500 before:ease-out before:content-[""]',
    'before:[clip-path:polygon(-1%_0,0_0,-25%_100%,-1%_100%)] hover:before:[clip-path:polygon(0_0,101%_0,101%_101%,0_101%)]',
    'disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );

interface BtnOwn {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
}

const Chevrons = () => <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />;

export function ButtonLink({ variant, size, arrow, className, children, ...props }: BtnOwn & LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Chevrons />}
    </Link>
  );
}

export function ButtonA({ variant, size, arrow, className, children, ...props }: BtnOwn & ComponentPropsWithoutRef<'a'>) {
  return (
    <a className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Chevrons />}
    </a>
  );
}

export const Button = forwardRef<HTMLButtonElement, BtnOwn & ComponentPropsWithoutRef<'button'>>(
  ({ variant, size, arrow, className, children, ...props }, ref) => (
    <button ref={ref} className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Chevrons />}
    </button>
  ),
);
Button.displayName = 'Button';

/* ------------------------------------------------------------------ Text link with chevrons */
export function ArrowLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-1.5 text-sm font-extrabold text-ink-900 hover:text-brand-600', className)}>
      <span>{children}</span>
      <ChevronsRight className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

/* ------------------------------------------------------------------ Section heading
   Ecofine "section title": green uppercase small title + 48px extra-bold title.
   `action` renders a button on the right (Ecofine "title two" widget). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  action,
  className,
  as: H = 'h2',
  light,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-6 md:mb-14',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto max-w-3xl')}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <H className={cn('section-title', light && 'text-white')}>{title}</H>
        {intro && <div className={cn('mt-5 text-[15px] leading-[27px]', light ? 'text-white/75' : 'text-ink-500')}>{intro}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ Badge */
export function Badge({ children, className, tone = 'brand' }: { children: ReactNode; className?: string; tone?: 'brand' | 'ink' | 'light' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    ink: 'bg-ink-100 text-ink-700',
    light: 'bg-white/15 text-white ring-1 ring-inset ring-white/30 backdrop-blur',
  };
  return <span className={cn('inline-flex items-center gap-1 rounded-[5px] px-2.5 py-1 text-xs font-bold', tones[tone], className)}>{children}</span>;
}

/* ------------------------------------------------------------------ Reveal on scroll
   Pure-CSS scroll-driven fade-up (see `.reveal` in index.css). Content is never
   hidden waiting for JavaScript; browsers without scroll timelines show it as is. */
export function Reveal({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' }) {
  return <Tag className={cn('reveal', className)}>{children}</Tag>;
}

/* ------------------------------------------------------------------ Section (Ecofine sections use 110px vertical rhythm) */
export function Section({ className, tone = 'white', children, id, ...rest }: ComponentPropsWithoutRef<'section'> & { tone?: 'white' | 'grey' | 'brand' | 'dark' }) {
  const tones = {
    white: 'bg-white',
    grey: 'bg-ink-50',
    brand: 'bg-brand-600 text-white',
    dark: 'bg-ink-900 text-ink-300',
  };
  return (
    <section id={id} className={cn('py-20 lg:py-[110px]', tones[tone], className)} {...rest}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ Leaf decoration (stand-in for Ecofine's corner leaf shapes) */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={cn('pointer-events-none text-brand-600', className)} aria-hidden fill="currentColor">
      <path d="M60 158c-2-40 2-86 14-130" fill="none" stroke="currentColor" strokeWidth="2" opacity=".35" />
      <path d="M72 40c18-22 40-26 46-24-2 14-14 36-46 40z" opacity=".22" />
      <path d="M66 78c-22-16-46-14-54-10 6 14 26 30 54 24z" opacity=".18" />
      <path d="M64 112c18-18 40-20 48-16-4 14-22 30-48 28z" opacity=".2" />
      <path d="M74 20C76 8 86 2 92 0c2 10-4 22-18 26z" opacity=".25" />
    </svg>
  );
}

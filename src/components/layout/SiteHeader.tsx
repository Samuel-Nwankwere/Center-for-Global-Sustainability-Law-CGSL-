import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronsRight, Linkedin, Mail, MapPin, Menu, Phone, Search, X } from 'lucide-react';
import { mainNav, site } from '@/content/site';
import type { NavItem } from '@/content/types';
import { images } from '@/lib/content';
import { asset, cn } from '@/lib/utils';
import { useLockBody, useScrolled } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/primitives';

function isActive(item: NavItem, pathname: string) {
  const paths = [item.to, ...(item.children?.map((c) => c.to) ?? [])];
  return paths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')));
}

/* ------------------------------------------------------------------ Top bar (Ecofine header-one .header-top) */
function TopBar({ overlay }: { overlay: boolean }) {
  return (
    <div className={cn('hidden h-[var(--topbar-h)] text-[12px] font-semibold lg:block', overlay ? 'border-b border-white/10 bg-ink-950/30 text-white/85 backdrop-blur-sm' : 'bg-ink-900 text-white/85')}>
      <div className="mx-auto flex h-full max-w-[80rem] items-center justify-between gap-6 px-8">
        <p className="flex items-center gap-6">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-brand-300" aria-hidden />
            <span className="text-white">Address:</span> {site.location}
          </span>
          <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
            <Phone className="h-3.5 w-3.5 text-brand-300" aria-hidden />
            <span className="text-white">Hot Line:</span> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
            <Mail className="h-3.5 w-3.5 text-brand-300" aria-hidden /> {site.email}
          </a>
        </p>
        <p className="flex items-center gap-3">
          <span className="text-white">Follow On:</span>
          {site.social.linkedin && (
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-brand-300">
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Desktop menu item with dropdown */
function DesktopItem({ item, light }: { item: NavItem; light: boolean }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const ref = useRef<HTMLLIElement>(null);
  const active = isActive(item, pathname);
  const closeTimer = useRef<number>();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const base = cn(
    'relative inline-flex h-[var(--header-h)] items-center gap-1 px-3 text-[14px] font-bold transition-colors xl:px-4',
    light ? 'text-white hover:text-brand-200' : 'text-ink-900 hover:text-brand-600',
    active && (light ? 'text-brand-200' : 'text-brand-600'),
  );

  if (!item.children) {
    return (
      <li>
        <NavLink to={item.to} className={base}>
          {item.label}
        </NavLink>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
    >
      <button type="button" className={base} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        {item.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        // Ecofine sub-menu: white panel, green top border, items slide on hover
        <div className="absolute left-0 top-full z-50 w-72 animate-fade-in border-t-[3px] border-brand-600 bg-white py-3 shadow-lift">
          <ul>
            {item.children.map((c) => (
              <li key={c.to + c.label}>
                <NavLink
                  to={c.to}
                  end
                  className={({ isActive: a }) =>
                    cn(
                      'group flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-ink-900 transition-all hover:pl-8 hover:text-brand-600',
                      a && 'text-brand-600',
                    )
                  }
                >
                  <ChevronsRight className="h-3.5 w-3.5 text-brand-600 opacity-0 transition group-hover:opacity-100" aria-hidden />
                  <span className="-ml-5 transition-all group-hover:ml-0">{c.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ Mobile drawer */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  useLockBody(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/60" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm animate-slide-in flex-col bg-white shadow-2xl">
        <div className="flex h-20 items-center justify-between border-b border-ink-200 px-5">
          <img src={asset(images.logo)} alt={site.name} className="h-10 w-auto" />
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[5px] bg-brand-600 text-white" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto" aria-label="Mobile">
          <ul>
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.label} className="border-b border-ink-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-bold text-ink-900"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                  >
                    {item.label}
                    <span className={cn('grid h-7 w-7 place-items-center rounded-[5px] transition', expanded === item.label ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600')}>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', expanded === item.label && 'rotate-180')} aria-hidden />
                    </span>
                  </button>
                  {expanded === item.label && (
                    <ul className="bg-ink-50 pb-2">
                      {item.children.map((c) => (
                        <li key={c.to + c.label}>
                          <NavLink to={c.to} end className={({ isActive }) => cn('block px-8 py-2.5 text-[14px] font-semibold text-ink-700', isActive && 'text-brand-600')}>
                            {c.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.label} className="border-b border-ink-200">
                  <NavLink to={item.to} className={({ isActive }) => cn('block px-5 py-4 text-base font-bold text-ink-900', isActive && 'text-brand-600')}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-ink-200 p-5 text-sm">
          <ButtonLink to="/donate" className="w-full" arrow>
            Donate Now
          </ButtonLink>
          <p className="text-center text-ink-500">{site.email}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Header (Ecofine Header 1) */
export function SiteHeader({ onSearch }: { onSearch: () => void }) {
  const { pathname } = useLocation();
  const overlay = pathname === '/'; // Home 1: header floats over the slider
  const stuck = useScrolled(260);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);
  const light = overlay && !stuck;

  const bar = (
    <div className="mx-auto flex h-[var(--header-h)] max-w-[80rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex shrink-0 items-center" aria-label={`${site.name} — home`}>
        <img src={asset(light ? images.logoLight : images.logo)} alt="" className={cn('h-11 w-auto sm:h-[52px]', light && 'brightness-[1.7]')} />
      </Link>
      <nav className="hidden lg:block" aria-label="Main">
        <ul className="flex items-center">
          {mainNav.map((item) => (
            <DesktopItem key={item.label} item={item} light={light} />
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSearch}
          className={cn('grid h-11 w-11 place-items-center rounded-[5px] transition', light ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white')}
          aria-label="Search the site"
          title="Search (Ctrl/⌘ K)"
        >
          <Search className="h-5 w-5" />
        </button>
        <ButtonLink to="/donate" arrow className="hidden sm:inline-flex">
          Donate
        </ButtonLink>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={cn('grid h-11 w-11 place-items-center rounded-[5px] lg:hidden', light ? 'bg-white/10 text-white' : 'bg-brand-600 text-white')}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[5px] focus:bg-white focus:px-4 focus:py-2 focus:text-brand-700 focus:shadow-lg">
        Skip to content
      </a>
      {/* In-flow header; on the home page it overlays the hero slider. */}
      <header className={cn('z-50 w-full', overlay ? 'absolute inset-x-0 top-0' : 'relative bg-white shadow-[0_1px_0_rgb(0_0_0/0.06)]')}>
        <TopBar overlay={overlay} />
        <div className={cn(overlay ? 'border-b border-white/10' : 'bg-white', stuck && 'invisible')}>{bar}</div>
      </header>
      {/* Sticky copy that slides in after scrolling (Ecofine .sticky-wrapper.sticky). */}
      {stuck && <div className="fixed inset-x-0 top-0 z-50 animate-sticky-in bg-white shadow-[0_0_10px_rgb(0_0_0/0.07)]">{bar}</div>}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

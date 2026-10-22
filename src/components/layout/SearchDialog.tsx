import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, FileText, Layers, Search, User, X, Compass, BookOpen } from 'lucide-react';
import { search, type SearchItem } from '@/lib/search';
import { useLockBody } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const kindIcon: Record<SearchItem['kind'], typeof FileText> = {
  Page: Compass,
  Domain: Layers,
  Program: BookOpen,
  Publication: FileText,
  Person: User,
};

const suggestions = ['Net zero', 'Just transition', 'Green bonds', 'Critical minerals', 'Human rights'];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = useMemo(() => search(query), [query]);
  useLockBody(open);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (item: SearchItem) => {
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === 'Enter' && results[active]) go(results[active]);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-fade-up overflow-hidden rounded-eco bg-white shadow-2xl ring-1 ring-ink-200" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-ink-100 px-5">
          <Search className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search domains, publications, people…"
            className="h-16 w-full bg-transparent text-lg text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Search query"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
          />
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 hover:bg-ink-100" aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Popular topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {query && results.length === 0 && <p className="p-6 text-center text-ink-500">No results for “{query}”.</p>}
          {results.length > 0 && (
            <ul id="search-results" role="listbox">
              {results.map((r, i) => {
                const KindIcon = kindIcon[r.kind];
                return (
                  <li key={r.kind + r.to} id={`sr-${i}`} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r)}
                      className={cn('flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left', i === active && 'bg-brand-50')}
                    >
                      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', i === active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600')}>
                        <KindIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink-900">{r.title}</span>
                        <span className="block truncate text-sm text-ink-500">
                          {r.kind}
                          {r.meta ? ` · ${r.meta}` : ''}
                        </span>
                      </span>
                      {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

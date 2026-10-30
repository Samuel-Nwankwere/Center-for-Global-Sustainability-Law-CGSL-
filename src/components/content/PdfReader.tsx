import { useEffect, useRef, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { cn } from '@/lib/utils';
import { useLockBody } from '@/lib/hooks';
import { usePageCanvas, type PdfStatus } from '@/lib/pdf';

const arrow = 'grid h-12 w-12 place-items-center transition disabled:pointer-events-none disabled:opacity-40 sm:h-14 sm:w-14';

/**
 * Full-screen reading view for one issue: the page is shown as large as the
 * screen allows, with arrows, keyboard (←/→/Esc) and swipe navigation.
 */
export function PdfReader({
  label,
  title,
  doc,
  status,
  page,
  numPages,
  onPage,
  onClose,
}: {
  label: string;
  title: string | null;
  doc: PDFDocumentProxy | null;
  status: PdfStatus;
  page: number;
  numPages: number | null;
  onPage: (page: number) => void;
  onClose: () => void;
}) {
  useLockBody(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  // Render wide enough for the screen; CSS scales the canvas down to fit.
  const { ref, ready } = usePageCanvas(doc, page, Math.min(window.innerWidth, 1100));

  const canPrev = page > 1;
  const canNext = numPages === null || page < numPages;
  const prev = () => canPrev && onPage(page - 1);
  const next = () => canNext && onPage(page + 1);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e: TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
  };

  const heading = title ? `${label}: ${title}` : label;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-ink-950/[0.98]" role="dialog" aria-modal="true" aria-label={heading}>
      <div className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 text-white sm:h-20 sm:px-6">
        <p className="min-w-0 leading-tight">
          <span className="block text-xs font-bold uppercase tracking-[2px] text-brand-300">{label}</span>
          {title && <span className="line-clamp-1 font-bold">{title}</span>}
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-sm font-semibold text-white/80" aria-live="polite">
            {page} / {numPages ?? '…'}
          </span>
          <button ref={closeRef} type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-[5px] bg-brand-600 text-white transition hover:bg-brand-700" aria-label="Close reader">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-24 sm:pb-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <canvas ref={ref} className={cn('max-h-full max-w-full bg-white shadow-lift transition-opacity', !ready && 'opacity-60')} aria-label={`Page ${page}`} role="img" />
        {status === 'error' ? (
          <p className="absolute rounded-[5px] bg-white px-5 py-3 text-sm font-semibold text-ink-900">This issue could not be loaded. Please try again later.</p>
        ) : (
          !ready && <span className="absolute h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" aria-hidden />
        )}
        <button type="button" onClick={prev} disabled={!canPrev} className={cn(arrow, 'absolute left-6 top-1/2 hidden -translate-y-1/2 bg-white text-brand-600 hover:bg-brand-50 sm:grid')} aria-label="Previous page">
          <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={next} disabled={!canNext} className={cn(arrow, 'absolute right-6 top-1/2 hidden -translate-y-1/2 bg-brand-600 text-white hover:bg-brand-700 sm:grid')} aria-label="Next page">
          <ArrowRight className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex shrink-0 justify-center pb-6 sm:hidden">
        <button type="button" onClick={prev} disabled={!canPrev} className={cn(arrow, 'bg-white text-brand-600')} aria-label="Previous page">
          <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={next} disabled={!canNext} className={cn(arrow, 'bg-brand-600 text-white')} aria-label="Next page">
          <ArrowRight className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

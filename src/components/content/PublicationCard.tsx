import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronsRight, Maximize2 } from 'lucide-react';
import type { SeriesIssue } from '@/content/types';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';
import { usePageCanvas, usePdfDocument } from '@/lib/pdf';
import { PdfReader } from './PdfReader';

const issueLabel = (n: number) => (n === 0 ? 'Introduction' : `Issue ${String(n).padStart(2, '0')}`);

const arrow = 'grid h-9 w-9 place-items-center shadow-card transition disabled:pointer-events-none disabled:opacity-40';

/**
 * One PDF carousel issue (Ecofine "blog v2" card styling). The cover is the
 * issue's own first page; the arrows page through the PDF in place, and the
 * expand button opens the full-screen reader. Each card keeps its own page.
 */
export function PublicationCard({ issue }: { issue: SeriesIssue }) {
  const label = issueLabel(issue.number);
  const pdf = usePdfDocument(issue.pdf);
  const [page, setPage] = useState(1);
  const [reading, setReading] = useState(false);
  const [width, setWidth] = useState(0);
  const { ref: box, inView } = useInView<HTMLDivElement>();

  const showCover = page === 1 && !!issue.cover;
  const { ref: canvasRef, ready } = usePageCanvas(pdf.doc, page, width, !showCover);

  // Without a pre-rendered cover, render page 1 from the PDF once the card is on screen.
  const { load } = pdf;
  useEffect(() => {
    if (!issue.cover && inView) load();
  }, [issue.cover, inView, load]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [box]);

  useEffect(() => {
    if (pdf.numPages) setPage((p) => Math.min(p, pdf.numPages!));
  }, [pdf.numPages]);

  const go = (p: number) => {
    pdf.load();
    setPage(Math.max(1, pdf.numPages ? Math.min(p, pdf.numPages) : p));
  };
  const open = () => {
    pdf.load();
    setReading(true);
  };

  const loading = !showCover && (pdf.status === 'loading' || (pdf.status === 'ready' && !ready) || (pdf.status === 'idle' && !issue.cover));
  const canNext = pdf.numPages === null || page < pdf.numPages;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-eco bg-white ring-1 ring-ink-200 transition duration-300 hover:shadow-lift hover:ring-transparent">
      <div ref={box} className="relative aspect-[4/5] overflow-hidden rounded-t-eco bg-ink-100">
        {issue.cover && <img src={issue.cover} alt="" loading="lazy" className={cn('absolute inset-0 h-full w-full object-contain', !showCover && 'invisible')} />}
        <canvas ref={canvasRef} className={cn('absolute inset-0 h-full w-full object-contain', showCover && 'invisible')} aria-hidden />
        <button type="button" onClick={open} className="absolute inset-0" aria-label={`Read ${label}${issue.title ? `: ${issue.title}` : ''}`} />
        {pdf.status === 'error' ? (
          <p className="absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-[5px] bg-white/95 p-3 text-center text-xs font-semibold text-ink-900">This issue could not be loaded.</p>
        ) : (
          loading && <span className="pointer-events-none absolute left-1/2 top-1/2 -ml-5 -mt-5 h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" aria-hidden />
        )}
        <button
          type="button"
          onClick={open}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-[5px] bg-white/90 text-brand-600 opacity-0 shadow-card transition hover:bg-brand-600 hover:text-white focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
          aria-label={`Expand ${label}`}
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <div className="absolute bottom-0 right-0 flex">
          <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={cn(arrow, 'bg-white text-brand-600 hover:bg-brand-50')} aria-label={`Previous page of ${label}`}>
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => go(page + 1)} disabled={!canNext} className={cn(arrow, 'bg-brand-600 text-white hover:bg-brand-700')} aria-label={`Next page of ${label}`}>
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[2px] text-brand-600">{label}</p>
        {issue.title && <h3 className="mt-2 line-clamp-3 text-[17px] font-bold leading-6 text-ink-900 transition group-hover:text-brand-600">{issue.title}</h3>}
        <div className="mt-auto flex items-center justify-between gap-2 whitespace-nowrap border-t border-ink-200 pt-4 text-xs sm:text-sm">
          <button type="button" onClick={open} className="inline-flex items-center gap-1.5 font-extrabold text-ink-900 hover:text-brand-600">
            Read Issue <ChevronsRight className="h-4 w-4 text-brand-600" aria-hidden />
          </button>
          <span className="text-ink-500" aria-live="polite">
            {page} / {pdf.numPages ?? '…'}
          </span>
        </div>
      </div>
      {reading && (
        <PdfReader
          label={label}
          title={issue.title}
          doc={pdf.doc}
          status={pdf.status}
          page={page}
          numPages={pdf.numPages}
          onPage={go}
          onClose={() => setReading(false)}
        />
      )}
    </article>
  );
}

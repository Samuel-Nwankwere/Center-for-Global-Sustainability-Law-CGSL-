import { useCallback, useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

/* PDF rendering for the publication series. pdf.js is loaded on demand (its
   own chunk) the first time a visitor pages through or opens an issue, and the
   legacy build is used so older mobile browsers are supported. */

let pdfjs: ReturnType<typeof importPdfjs> | null = null;

function importPdfjs() {
  return Promise.all([import('pdfjs-dist/legacy/build/pdf.mjs'), import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    return lib;
  });
}

function loadPdfjs() {
  pdfjs ??= importPdfjs().catch((e) => {
    pdfjs = null; // allow a retry after a network error
    throw e;
  });
  return pdfjs;
}

export type PdfStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Load a PDF when `load()` is first called; the document is destroyed on unmount. */
export function usePdfDocument(url: string) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<PdfStatus>('idle');
  const task = useRef<PDFDocumentLoadingTask | null>(null);
  const started = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      started.current = false;
      task.current?.destroy();
      task.current = null;
      setDoc(null);
      setStatus('idle');
    };
  }, [url]);

  const load = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setStatus('loading');
    loadPdfjs()
      .then((lib) => {
        if (!alive.current) return null;
        // Range requests without pre-fetching: only the bytes for the pages viewed are downloaded.
        task.current = lib.getDocument({ url, disableStream: true, disableAutoFetch: true, isEvalSupported: false });
        return task.current.promise;
      })
      .then(
        (d) => {
          if (!d || !alive.current) return;
          setDoc(d);
          setStatus('ready');
        },
        () => {
          task.current = null;
          started.current = false;
          if (alive.current) setStatus('error');
        },
      );
  }, [url]);

  return { doc, status, numPages: doc?.numPages ?? null, load };
}

/** Largest canvas width we render, in device pixels (keeps memory in check on large screens). */
const MAX_PX = 1800;

/**
 * Render one page of `doc` into the returned canvas ref at `cssWidth` (scaled for
 * the screen's pixel density). Rendering happens off-screen and is copied in
 * when finished, so the previous page stays visible until the next is ready.
 */
export function usePageCanvas(doc: PDFDocumentProxy | null, pageNumber: number, cssWidth: number, enabled = true) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState<number | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!doc || !canvas || !enabled || cssWidth <= 0) return;
    let cancelled = false;
    let task: RenderTask | undefined;
    doc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const px = Math.min(cssWidth * Math.min(window.devicePixelRatio || 1, 2), MAX_PX);
        const viewport = page.getViewport({ scale: px / base.width });
        const off = document.createElement('canvas');
        off.width = Math.floor(viewport.width);
        off.height = Math.floor(viewport.height);
        task = page.render({ canvasContext: off.getContext('2d')!, viewport });
        return task.promise.then(() => {
          if (cancelled) return;
          canvas.width = off.width;
          canvas.height = off.height;
          canvas.getContext('2d')!.drawImage(off, 0, 0);
          off.width = 0;
          setPainted(pageNumber);
        });
      })
      .catch(() => {
        /* render cancelled by a page change or unmount */
      });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, cssWidth, enabled]);

  // Free the canvas bitmap when the viewer goes away.
  useEffect(() => {
    const canvas = ref.current;
    return () => {
      if (canvas) canvas.width = 0;
    };
  }, []);

  return { ref, ready: painted === pageNumber };
}

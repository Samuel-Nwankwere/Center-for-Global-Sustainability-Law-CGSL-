#!/usr/bin/env python3
"""
Create gallery covers for the publication series.

For every `src/assets/series/<slug>/intro.pdf` and `issue-N.pdf` without a
matching `.webp`, render the PDF's first page and save it as a WebP next to it.
The cover is the issue's own first page, so the original design is preserved;
the full PDF is only downloaded when a visitor opens the issue.

Requires poppler's `pdftoppm` (apt install poppler-utils / brew install poppler)
and Pillow. Usage:

    npm run series:covers            # new PDFs only
    npm run series:covers -- --force # re-render every cover
"""
import glob, os, shutil, subprocess, sys, tempfile
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'assets', 'series')
WIDTH = 720  # ~2x the widest card, sharp on high-density screens


def main(force=False):
    if not shutil.which('pdftoppm'):
        sys.exit('pdftoppm not found: install poppler-utils (Linux) or poppler (macOS).')
    pdfs = sorted(glob.glob(os.path.join(ROOT, '*', 'intro.pdf')) + glob.glob(os.path.join(ROOT, '*', 'issue-*.pdf')))
    if not pdfs:
        print('No series PDFs found in', os.path.normpath(ROOT))
        return
    for pdf in pdfs:
        out = pdf[:-4] + '.webp'
        name = os.path.relpath(out, ROOT)
        if os.path.exists(out) and not force:
            print('skip ', name)
            continue
        with tempfile.TemporaryDirectory() as tmp:
            # Render at twice the target width, then downsample for clean text edges.
            subprocess.run(['pdftoppm', '-f', '1', '-l', '1', '-png', '-scale-to-x', str(WIDTH * 2), '-scale-to-y', '-1', pdf, os.path.join(tmp, 'page')], check=True)
            im = Image.open(glob.glob(os.path.join(tmp, 'page*.png'))[0]).convert('RGB')
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
            im.save(out, 'WEBP', quality=88, method=6)
        print('cover', name, f'{im.width}x{im.height}')


if __name__ == '__main__':
    main(force='--force' in sys.argv)

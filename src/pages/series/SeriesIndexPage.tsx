import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { images, publicationSeries } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { SeriesCollection } from '@/components/sections/SeriesCollection';

const intro = 'Collections of CGSL research and commentary, published issue by issue.';

export default function SeriesIndexPage() {
  useSeo('Series', `${intro} ${publicationSeries.map((s) => s.title).join(', ')}.`);
  const { hash } = useLocation();

  // Jump to a series (e.g. /series#paris-agreement) once this lazily loaded page has rendered.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <PageHero eyebrow="Publications" title="Series" image={images.series} crumbs={[{ label: 'Series' }]} intro={intro} />
      {publicationSeries.map((s, i) => (
        <SeriesCollection key={s.slug} series={s} tone={i % 2 ? 'grey' : 'white'} />
      ))}
    </>
  );
}

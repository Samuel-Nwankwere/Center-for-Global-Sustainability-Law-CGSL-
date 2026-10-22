import { CheckCircle2, Mail } from 'lucide-react';
import { resourcePages } from '@/content/pages';
import { site } from '@/content/site';
import { images } from '@/lib/content';
import { asset } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonA, ButtonLink, Container, Section } from '@/components/ui/primitives';
import NotFoundPage from './NotFoundPage';

const parentFor = (eyebrow: string) =>
  eyebrow === 'About' ? { label: 'About', to: '/about' } : { label: 'Publications', to: '/publications' };

/** Shared template for the informational pages (reports, white papers, proposals…). */
export default function ResourcePage({ pageKey }: { pageKey: string }) {
  const page = resourcePages[pageKey];
  useSeo(page?.title, page?.intro[0]);
  if (!page) return <NotFoundPage />;
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} image={images[page.imageKey]} crumbs={[parentFor(page.eyebrow), { label: page.title }]} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{page.heading}</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
              {page.intro.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            {page.closing && <p className="mt-8 border-l-4 border-brand-500 pl-5 font-serif text-xl text-ink-800">{page.closing}</p>}
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-eco bg-ink-50 p-8 ring-1 ring-ink-200/70">
              <h3 className="font-sans text-lg font-semibold text-ink-900">{page.listTitle}</h3>
              <ul className="mt-5 space-y-3">
                {page.list.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 overflow-hidden rounded-eco bg-brand-700 p-8 text-white">
              <Mail className="h-7 w-7 text-brand-200" aria-hidden />
              <p className="mt-4 text-lg font-medium">{page.contactLine}</p>
              <p className="text-brand-100">Get in touch with our team.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonA href={`mailto:${site.email}?subject=${encodeURIComponent(page.title)}`} variant="light">
                  {site.email}
                </ButtonA>
                <ButtonLink to="/contact" variant="outline-light">
                  Contact form
                </ButtonLink>
              </div>
            </div>
          </aside>
        </Container>
        {pageKey !== 'sustainability' && (
          <Container className="mt-16">
            <div className="flex flex-col items-center gap-4 rounded-eco border-2 border-dashed border-ink-200 p-10 text-center">
              <img src={asset(images.logo)} alt="" className="h-10 w-auto opacity-70" loading="lazy" />
              <p className="max-w-lg text-ink-600">
                Published {page.title.toLowerCase()} will be listed here. Subscribe to our newsletter below to be notified when new documents are released.
              </p>
            </div>
          </Container>
        )}
      </Section>
    </>
  );
}

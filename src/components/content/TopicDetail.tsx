import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronsRight, Mail, Phone } from 'lucide-react';
import type { Block } from '@/content/types';
import { site } from '@/content/site';
import { asset, cn } from '@/lib/utils';
import { ButtonLink, Container, Section } from '@/components/ui/primitives';
import { PageHero, type Crumb } from '@/components/ui/PageHero';
import { Widget } from '@/components/ui/Widget';
import { RichText } from './RichText';

interface SideLink {
  label: string;
  to: string;
}

/** Ecofine "service details" layout, shared by domain and programme pages. */
export function TopicDetail({
  eyebrow,
  title,
  tagline,
  image,
  crumbs,
  body,
  sideTitle,
  sideLinks,
  meta,
  after,
}: {
  eyebrow: string;
  title: string;
  tagline?: string | null;
  image: string | null;
  crumbs: Crumb[];
  body: Block[];
  sideTitle: string;
  sideLinks: SideLink[];
  meta?: ReactNode;
  after?: ReactNode;
}) {
  return (
    <>
      <PageHero title={title} image={image} crumbs={crumbs} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <article className="min-w-0 lg:col-span-8">
            {image && <img src={asset(image)} alt="" className="aspect-[16/8] w-full rounded-eco object-cover" />}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {meta}
              <p className="text-sm font-bold uppercase tracking-[3px] text-brand-600">{eyebrow}</p>
            </div>
            <h2 className="mt-3 text-[1.8rem] font-extrabold leading-tight text-ink-900 lg:text-[36px] lg:leading-[45px]">{title}</h2>
            {tagline && <p className="mt-3 text-xl font-semibold leading-8 text-brand-700">{tagline}</p>}
            <RichText blocks={body} className="mt-6" />
          </article>

          <aside className="space-y-8 lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              {sideLinks.length > 0 && (
                <Widget title={sideTitle}>
                  <ul className="space-y-3">
                    {sideLinks.map((l) => (
                      <li key={l.to}>
                        <NavLink
                          to={l.to}
                          end
                          className={({ isActive }) =>
                            cn(
                              'group flex items-center justify-between gap-3 rounded-[5px] px-5 py-3.5 font-bold transition',
                              isActive ? 'bg-brand-600 text-white' : 'bg-white text-ink-900 hover:bg-brand-600 hover:text-white',
                            )
                          }
                        >
                          <span className="leading-snug">{l.label}</span>
                          <ChevronsRight className="h-4 w-4 shrink-0" aria-hidden />
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Widget>
              )}
              <div className="relative isolate overflow-hidden rounded-eco bg-brand-900 p-8 text-center text-white">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/60 to-brand-900" />
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-600">
                  <Phone className="h-7 w-7" aria-hidden />
                </span>
                <p className="mt-5 text-2xl font-extrabold">Work with us on this</p>
                <p className="mt-2 leading-7 text-white/80">Need regulatory intelligence, an informed proposal, or tailored training in this area?</p>
                <a href={site.phoneHref} className="mt-4 block text-xl font-extrabold hover:text-brand-200">
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}?subject=${encodeURIComponent(title)}`} className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden /> {site.email}
                </a>
                <ButtonLink to="/advisory" variant="light" arrow className="mt-6">
                  Advisory Services
                </ButtonLink>
              </div>
            </div>
          </aside>
        </Container>
      </Section>
      {after}
    </>
  );
}

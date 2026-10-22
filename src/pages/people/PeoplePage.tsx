import { useSearchParams } from 'react-router-dom';
import { images, people } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink, Container, Section } from '@/components/ui/primitives';
import { PersonCard } from '@/components/content/Cards';
import { CtaBand } from '@/components/sections/CtaBand';

const teams = [
  {
    key: 'executive',
    label: 'Global Executive Team',
    intro: 'The Global Executive Team provides strategic leadership and operational direction across all regions, driving performance, innovation, and organizational excellence.',
  },
  {
    key: 'board',
    label: 'Board of Directors',
    intro: 'The Board of Directors provides strategic oversight and governance, guiding the organization’s vision, performance, and long-term sustainability.',
  },
  {
    key: 'intern',
    label: 'Our Interns',
    intro: 'Our interns are emerging professionals who contribute fresh perspectives while gaining practical experience across our programs and initiatives. Through mentorship and hands-on engagement, we nurture talent aligned with our mission.',
  },
] as const;

type TeamKey = (typeof teams)[number]['key'];

export default function PeoplePage() {
  useSeo('Our People', teams[0].intro);
  const [params, setParams] = useSearchParams();
  const team = (teams.find((t) => t.key === params.get('team'))?.key ?? 'executive') as TeamKey;
  const current = teams.find((t) => t.key === team)!;
  const members = people.filter((p) => (team === 'board' ? p.board : p.group === team));

  return (
    <>
      <PageHero eyebrow="People" title="Our people" image={images.overview} crumbs={[{ label: 'People' }]} intro="A global network of lawyers, policy specialists and researchers working across Africa, the Americas, Europe and Asia." />
      <Section>
        <Container>
          <div className="flex flex-col gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold sm:text-4xl">{current.label}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{current.intro}</p>
            </div>
            <div className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-[5px] bg-ink-50 p-1 ring-1 ring-ink-200" role="tablist" aria-label="Teams">
              {teams.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={team === t.key}
                  onClick={() => setParams(t.key === 'executive' ? {} : { team: t.key }, { replace: true, preventScrollReset: true })}
                  className={cn(
                    'shrink-0 rounded-[5px] px-4 py-2 text-sm font-medium transition',
                    team === t.key ? 'bg-white text-brand-700 shadow' : 'text-ink-600 hover:text-ink-900',
                  )}
                >
                  {t.label}
                  <span className="ml-1.5 text-xs text-ink-400">{people.filter((p) => (t.key === 'board' ? p.board : p.group === t.key)).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div role="tabpanel" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((p) => (
              <PersonCard key={p.slug} person={p} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Join a global community of changemakers"
        text="We welcome volunteers, interns and collaborators who share our commitment to a just and sustainable transition."
        actions={
          <>
            <ButtonLink to="/get-involved/volunteer" variant="light" arrow>
              Volunteer with us
            </ButtonLink>
            <ButtonLink to="/get-involved/partner" variant="outline-light">
              Partner with us
            </ButtonLink>
          </>
        }
      />
    </>
  );
}

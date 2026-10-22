import { programsIntro } from '@/content/pages';
import { images, programs } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink, Container, Reveal, Section } from '@/components/ui/primitives';
import { ProgramCard } from '@/components/content/Cards';
import { CtaBand } from '@/components/sections/CtaBand';

export default function ProgramsPage() {
  useSeo('Programs & Initiatives', programsIntro);
  return (
    <>
      <PageHero eyebrow="What we do" title="Programs & initiatives" image={images.programs} crumbs={[{ label: 'Programs' }]} intro="Flagship research programmes where CGSL builds the legal foundations for a fair and sustainable economy." />
      <Section>
        <Container>
          <p className="max-w-4xl font-serif text-xl leading-relaxed text-ink-800 sm:text-2xl">{programsIntro}</p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {programs.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 80}>
                <ProgramCard program={p} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Sponsor or collaborate on a program"
        text="Support flagship programs such as Net Zero Law, Just Transition and Legal Innovation, or join our joint research initiatives."
        actions={
          <>
            <ButtonLink to="/get-involved/partner" variant="light" arrow>
              Partner with us
            </ButtonLink>
            <ButtonLink to="/domains" variant="outline-light">
              Explore domains
            </ButtonLink>
          </>
        }
      />
    </>
  );
}

import { useParams } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { articles, getPerson, people, personForAuthor } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Badge, ButtonA, ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { Widget } from '@/components/ui/Widget';
import { ArticleRow, Avatar, PersonCard } from '@/components/content/Cards';
import NotFoundPage from '../NotFoundPage';

/** Ecofine "team details" layout. */
export default function PersonPage() {
  const { slug = '' } = useParams();
  const person = getPerson(slug);
  useSeo(person?.name, person?.bio[0]);
  if (!person) return <NotFoundPage />;

  const authored = articles.filter((a) => a.authors.some((name) => personForAuthor(name)?.slug === person.slug));
  const teamPath = person.group === 'intern' ? '/people?team=intern' : '/people';
  const colleagues = people.filter((p) => p.group === person.group && p.slug !== person.slug).slice(0, 4);

  return (
    <>
      <PageHero title="Team Details" crumbs={[{ label: 'People', to: teamPath }, { label: person.name }]} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-5">
            <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <Avatar person={person} className="aspect-[4/5] w-full rounded-eco text-7xl" />
              {authored.length > 0 && (
                <Widget title="Publications">
                  <div className="space-y-6">
                    {authored.map((a) => (
                      <ArticleRow key={a.slug} article={a} />
                    ))}
                  </div>
                </Widget>
              )}
            </div>
          </aside>
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Badge>{person.group === 'intern' ? 'Intern' : 'Global Executive Team'}</Badge>
              {person.board && <Badge tone="ink">Board of Directors</Badge>}
            </div>
            <h1 className="mt-4 text-[2.25rem] font-extrabold leading-tight lg:text-[43px]">{person.name}</h1>
            <p className="mt-2 text-xl font-bold text-brand-600">{person.role}</p>
            {person.email && (
              <div className="mt-8 flex flex-wrap items-center gap-6 rounded-eco bg-ink-50 p-6">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white">
                  <Mail className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-lg font-extrabold text-ink-900">{person.email}</p>
                </div>
                <ButtonA href={`mailto:${person.email}`} arrow className="sm:ml-auto">
                  Get In Touch
                </ButtonA>
              </div>
            )}
            <h2 className="mt-10 text-2xl font-extrabold">Biography</h2>
            <div className="mt-4 space-y-5 text-[15px] leading-[27px]">
              {person.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ButtonLink to={teamPath} variant="secondary" className="mt-10">
              Back To The Team
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {colleagues.length > 0 && (
        <Section tone="grey">
          <Container>
            <SectionHeading eyebrow="Our Team" title="Colleagues" action={<ButtonLink to={teamPath} arrow>View All</ButtonLink>} />
            <div className="grid gap-x-[30px] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {colleagues.map((c) => (
                <PersonCard key={c.slug} person={c} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

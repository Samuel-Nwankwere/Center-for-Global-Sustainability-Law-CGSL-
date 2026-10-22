import { useParams } from 'react-router-dom';
import { getProgram, programs, articlesBySeries } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { Icon } from '@/components/ui/Icon';
import { TopicDetail } from '@/components/content/TopicDetail';
import { RelatedArticles } from '@/components/content/RelatedArticles';
import NotFoundPage from '../NotFoundPage';

export default function ProgramDetailPage() {
  const { slug = '' } = useParams();
  const program = getProgram(slug);
  useSeo(program?.title, program?.summary);
  if (!program) return <NotFoundPage />;

  return (
    <TopicDetail
      eyebrow="Program"
      title={program.title}
      image={program.image}
      crumbs={[{ label: 'Programs', to: '/programs' }, { label: program.title }]}
      body={program.body}
      sideTitle="Other programs"
      sideLinks={programs.filter((p) => p.slug !== program.slug).map((p) => ({ label: p.title, to: `/programs/${p.slug}` }))}
      meta={
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Icon name={program.icon} className="h-6 w-6" />
        </span>
      }
      after={<RelatedArticles slugs={program.related} fallback={articlesBySeries('digest')} />}
    />
  );
}

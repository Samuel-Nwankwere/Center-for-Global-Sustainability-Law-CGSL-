import { useParams } from 'react-router-dom';
import { domains, getDomain, articlesBySeries } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { Icon } from '@/components/ui/Icon';
import { TopicDetail } from '@/components/content/TopicDetail';
import { RelatedArticles } from '@/components/content/RelatedArticles';
import NotFoundPage from '../NotFoundPage';

export default function DomainDetailPage() {
  const { slug = '' } = useParams();
  const domain = getDomain(slug);
  useSeo(domain?.title, domain?.tagline ?? domain?.summary);
  if (!domain) return <NotFoundPage />;

  const siblings = domains.filter((d) => d.category === domain.category && d.slug !== domain.slug);
  return (
    <TopicDetail
      eyebrow={domain.category}
      title={domain.title}
      tagline={domain.tagline}
      image={domain.image}
      crumbs={[{ label: 'Sustainability Domains', to: '/domains' }, { label: domain.title }]}
      body={domain.body}
      sideTitle={`More in ${domain.category}`}
      sideLinks={siblings.map((d) => ({ label: d.title, to: `/domains/${d.slug}` }))}
      meta={
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Icon name={domain.icon} className="h-6 w-6" />
        </span>
      }
      after={<RelatedArticles slugs={domain.related} fallback={articlesBySeries('digest')} />}
    />
  );
}

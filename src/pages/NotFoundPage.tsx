import { useSeo } from '@/lib/hooks';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';

/** Ecofine 404: banner + large outlined "404" and a way back. */
export default function NotFoundPage() {
  useSeo('Page not found');
  return (
    <>
      <PageHero title="Page Not Found" crumbs={[{ label: '404' }]} />
      <section className="py-20 lg:py-[110px]">
        <Container className="max-w-2xl text-center">
          <p className="text-[108px] font-extrabold leading-none text-brand-600 sm:text-[162px]">404</p>
          <h2 className="mt-4 text-3xl font-extrabold">Oops! That page can’t be found</h2>
          <p className="mt-4">The page may have moved as part of our new website. Use search, or head back to the homepage.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/" arrow>
              Back To Home
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Contact Us
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

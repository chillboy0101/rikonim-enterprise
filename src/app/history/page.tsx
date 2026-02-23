import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { PageRenderer } from '@/components/PageRenderer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getSanityPageByRoute } from '@/lib/sanityPages';
import type { SanityPageSection } from '@/lib/sanityPages';
import { site } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'History',
  description:
    'Our story since 2013. Learn how Rikonim Enterprise has grown as a building and civil engineering contractor delivering construction in Ghana.'
};

export default async function HistoryPage() {
  const page = await getSanityPageByRoute('/history');

  if (page?.enabled && page?.sections?.length) {
    const hero = page.sections.find(
      (s): s is Extract<SanityPageSection, { _type: 'heroSection' }> => s._type === 'heroSection'
    );
    return (
      <>
        {hero ? (
          <PageHero
            title={hero.title ?? 'History'}
            subtitle={hero.subtitle}
            imageUrl={hero.imageUrl ?? 'https://images.pexels.com/photos/8961142/pexels-photo-8961142.jpeg?auto=compress&cs=tinysrgb&w=2400'}
            videoUrl={hero.videoUrl}
          />
        ) : null}
        <PageBreadcrumb current="History" />
        <PageRenderer sections={page.sections} skipHero />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="History"
        subtitle={`Our story since ${site.founded}.`}
        imageUrl="https://images.pexels.com/photos/8961142/pexels-photo-8961142.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.company}
      />

      <PageBreadcrumb current="History" />

      <Section>
        <Container>
          <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-brand-steel">
            <p>
              {site.name} was founded in {site.founded} to deliver high-quality building and civil
              engineering services with strict site discipline and transparent project management.
            </p>
            <p>
              This page is a placeholder you can expand with major milestones, signature projects,
              and growth across Ghana and West Africa.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

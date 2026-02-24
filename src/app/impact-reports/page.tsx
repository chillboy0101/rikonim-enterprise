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
  title: 'Impact Reports',
  description:
    'Impact reports from Rikonim Enterprise—safety performance, sustainability and community outcomes across construction and civil engineering work in Ghana.'
};

export default async function ImpactReportsPage() {
  const page = await getSanityPageByRoute('/impact-reports');

  if (page?.enabled && page?.sections?.length) {
    const hero = page.sections.find(
      (s): s is Extract<SanityPageSection, { _type: 'heroSection' }> => s._type === 'heroSection'
    );
    return (
      <>
        {hero ? (
          <PageHero
            title={hero.title ?? 'Impact Reports'}
            subtitle={hero.subtitle}
            imageUrl={hero.imageUrl ?? 'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=2400'}
            videoUrl={hero.videoUrl}
          />
        ) : null}
        <PageBreadcrumb current="Impact Reports" />
        <PageRenderer sections={page.sections} skipHero pageId={page._id} />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Impact Reports"
        subtitle="Safety, sustainability, and community impact."
        imageUrl="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.services}
      />

      <PageBreadcrumb current="Impact Reports" />

      <Section>
        <Container>
          <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-brand-steel">
            <p>
              This page is ready for published reports on safety performance, environmental
              responsibility, and local community outcomes.
            </p>
            <p>
              If you provide report files (PDFs), I can add a download list with year filters.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

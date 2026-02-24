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
  title: 'Media',
  description:
    'Media and updates from Rikonim Enterprise—news, photos and construction progress highlights from building and civil engineering projects in Ghana.'
};

export default async function MediaPage() {
  const page = await getSanityPageByRoute('/media');

  if (page?.enabled && page?.sections?.length) {
    const hero = page.sections.find(
      (s): s is Extract<SanityPageSection, { _type: 'heroSection' }> => s._type === 'heroSection'
    );
    return (
      <>
        {hero ? (
          <PageHero
            title={hero.title ?? 'Media'}
            subtitle={hero.subtitle}
            imageUrl={hero.imageUrl ?? 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=2400'}
            videoUrl={hero.videoUrl}
          />
        ) : null}
        <PageBreadcrumb current="Media" />
        <PageRenderer sections={page.sections} skipHero pageId={page._id} />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Media"
        subtitle="News, photos, and project updates."
        imageUrl="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.projects}
      />

      <PageBreadcrumb current="Media" />

      <Section>
        <Container>
          <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-brand-steel">
            <p>
              Use this page to publish press releases, construction progress highlights, and media
              assets.
            </p>
            <p>Updates will be published here as new announcements and project highlights become available.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}

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
  title: 'Blog',
  description:
    'Construction insights from Rikonim Enterprise—engineering methods, quality control, scheduling and safety culture for projects in Ghana.'
};

export default async function BlogPage() {
  const page = await getSanityPageByRoute('/blog');

  if (page?.enabled && page?.sections?.length) {
    const hero = page.sections.find(
      (s): s is Extract<SanityPageSection, { _type: 'heroSection' }> => s._type === 'heroSection'
    );
    return (
      <>
        {hero ? (
          <PageHero
            title={hero.title ?? 'Blog'}
            subtitle={hero.subtitle}
            imageUrl={hero.imageUrl ?? 'https://images.pexels.com/photos/2101138/pexels-photo-2101138.jpeg?auto=compress&cs=tinysrgb&w=2400'}
            videoUrl={hero.videoUrl}
          />
        ) : null}
        <PageBreadcrumb current="Blog" />
        <PageRenderer sections={page.sections} skipHero pageId={page._id} />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Blog"
        subtitle="Insights from the field, project delivery, and safety culture."
        imageUrl="https://images.pexels.com/photos/2101138/pexels-photo-2101138.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.projects}
      />

      <PageBreadcrumb current="Blog" />

      <Section>
        <Container>
          <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-brand-steel">
            <p>
              This is a placeholder blog page. You can publish articles about engineering methods,
              quality control, scheduling, and community impact.
            </p>
            <p>
              Tell me if you want the blog to be dynamic (CMS-driven) or static (markdown files).
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

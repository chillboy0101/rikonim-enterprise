import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog'
};

export default function BlogPage() {
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

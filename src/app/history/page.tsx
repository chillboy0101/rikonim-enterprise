import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'History',
  description:
    'Our story since 2013. Learn how Rikonim Enterprise has grown as a building and civil engineering contractor delivering construction in Ghana.'
};

export default function HistoryPage() {
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

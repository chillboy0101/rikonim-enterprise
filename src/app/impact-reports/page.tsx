import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Impact Reports'
};

export default function ImpactReportsPage() {
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

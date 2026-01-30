import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Careers'
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Careers"
        subtitle="Build with us. Explore opportunities and grow your impact."
        imageUrl="https://images.pexels.com/photos/8961143/pexels-photo-8961143.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.company}
      />

      <PageBreadcrumb current="Careers" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">
                Careers
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                Why join {site.name}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-brand-steel">
                We’re building a team of disciplined professionals committed to safe execution,
                quality workmanship, and long-term client outcomes.
              </p>
              <div className="mt-7 space-y-4 text-sm leading-relaxed text-brand-steel">
                <p>To enquire about openings, email {site.contact.email}.</p>
                <p>For urgent matters, call {site.contact.phone}.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
